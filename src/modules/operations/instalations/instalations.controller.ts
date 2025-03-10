import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InstalationsService } from './instalations.service';
import { CreateInstalationDto } from './dto/create-instalation.dto';
import { UpdateInstalationDto } from './dto/update-instalation.dto';
import { DeepPartial } from 'typeorm';
import { Instalation } from './entities/instalation.entity';

@Controller('instalations')
export class InstalationsController {
  constructor(private readonly instalationsService: InstalationsService) {}

  @Get()
  findAll() {
    return this.instalationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.instalationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInstalationDto: DeepPartial<Instalation> ) {
    return this.instalationsService.update(id, updateInstalationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.instalationsService.remove(id);
  }
}
