import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InstallationsService } from './installations.service';
import { CreateInstallationDto } from './dto/create-installation.dto';
import { UpdateInstallationDto } from './dto/update-installation.dto';
import { DeepPartial } from 'typeorm';
import { Installation } from './entities/installation.entity';
import { ApiBody, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { StatusChangeDto } from './dto/change-status.dto';

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

  @ApiOperation({
    summary: 'Cambiar instaladores y otra data',
    description: `Se puede editar instaladores o la fecha de inicio 
                  solo si la instalación esta pendiente o pospuesta`
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateInstallationDto ) {
    return await this.installationsService.update(id, data);
  }

  @ApiOperation({
    summary: 'Cambiar el estado',
    description: `Permite cambiar el estado de una instalación teniendo  
                  en cuenta el siguiente flujo : 

                  Pendiente => En proceso / Cancelada  
                  En proceso => Pospuesta / Cancelada  
                  A revisar => Finalizada / Pospuesta

                  Para transicionar de En proceso => A revsiar se debe hacer un 
                  POST installations/id/images, con las imagenes correspondinetes
                  y este maneja por si solo el cambio de estado
                 `
  })
  @Patch(':id/status')
  async changeStatus(@Param('id') id: string, @Body() data: StatusChangeDto ) {
    return await this.installationsService.statusChange(id, data);
  }

  @ApiOperation({
    summary: 'Subida de imagenes para revision',
  })
  @Post(':id/images')
  async loadImages(@Param('id') id: string, @Body() updateInstallationDto: DeepPartial<Installation> ) {
    return await this.installationsService.update(id, updateInstallationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.installationsService.remove(id);
  }
}
