import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, UseInterceptors, UsePipes, HttpStatus, HttpCode } from '@nestjs/common';
import { InstallationsService } from './installations.service';
import { CreateInstallationDto } from './dto/create-installation.dto';
import { UpdateInstallationDto } from './dto/update-installation.dto';
import { DeepPartial } from 'typeorm';
import { Installation } from './entities/installation.entity';
import { ApiBody, ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { StatusChangeDto } from './dto/change-status.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesPipe } from 'src/common/pipes/file/files-pipe';

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
                  solo si la instalación esta pendiente o pospuesta`,
  })
  @ApiResponse({
    status: HttpStatus.OK, type: Installation,
  })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  @HttpCode(HttpStatus.INTERNAL_SERVER_ERROR)
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
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.BAD_REQUEST)
  @Patch(':id/status')
  async changeStatus(@Param('id') id: string, @Body() data: StatusChangeDto ) {
    return await this.installationsService.statusChange(id, data);
  }

  @ApiOperation({
    summary: 'Subida de imagenes para revision',
  })
  @UseInterceptors(FilesInterceptor('files', 10))
  @UsePipes(
      new FilesPipe(1000, 10000000, [
        'image/png',
        'image/jpeg',
        'application/pdf',
      ]),
    )
  @Post(':id/images')
  async loadImages(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[]) {
    return await this.installationsService.sendToReview(id, files);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.installationsService.remove(id);
  }
}
