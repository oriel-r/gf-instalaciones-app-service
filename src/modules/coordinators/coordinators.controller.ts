import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { CoordinatorsService } from './coordinators.service';
import { UpdateCoordinatorDto } from './dto/update-coordinator.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Coordinators')
@Controller('coordinators')
export class CoordinatorsController {
  constructor(private readonly coordinatorsService: CoordinatorsService) {}

  @Get()
  async getAll() {
    return await this.coordinatorsService.getAll()
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoordinatorDto: UpdateCoordinatorDto) {
    return this.coordinatorsService.update(+id, updateCoordinatorDto);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.coordinatorsService.findById(id);
  }
}
