import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InstallationsService } from './installations.service';
import { CreateInstallationDto } from './dto/create-installation.dto';
import { UpdateInstallationDto } from './dto/update-installation.dto';
import { DeepPartial } from 'typeorm';
import { Installation } from './entities/installation.entity';

@Controller('installations')
export class InstallationsController {
  constructor(private readonly installationsService: InstallationsService) {}

  @Get()
  findAll() {
    return this.installationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.installationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInstallationDto: DeepPartial<Installation> ) {
    return this.installationsService.update(id, updateInstallationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.installationsService.remove(id);
  }
}
