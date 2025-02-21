import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CoordinatorsService } from './coordinators.service';
import { CreateCoordinatorDto } from './dto/create-coordinator.dto';
import { UpdateCoordinatorDto } from './dto/update-coordinator.dto';

@Controller('coordinators')
export class CoordinatorsController {
  constructor(private readonly coordinatorsService: CoordinatorsService) {}

  @Post()
  create(@Body() createCoordinatorDto: CreateCoordinatorDto) {
    return this.coordinatorsService.create(createCoordinatorDto);
  }

  @Get()
  findAll() {
    return this.coordinatorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coordinatorsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoordinatorDto: UpdateCoordinatorDto) {
    return this.coordinatorsService.update(+id, updateCoordinatorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coordinatorsService.remove(+id);
  }
}
