import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { CoordinatorsService } from './coordinators.service';
import { UpdateCoordinatorDto } from './dto/update-coordinator.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Coordinators')
@Controller('coordinators')
export class CoordinatorsController {
  constructor(private readonly coordinatorsService: CoordinatorsService) {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoordinatorDto: UpdateCoordinatorDto) {
    return this.coordinatorsService.update(+id, updateCoordinatorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coordinatorsService.remove(+id);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.coordinatorsService.findById(id);
  }
}
