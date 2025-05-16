import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, UseInterceptors, UsePipes, HttpStatus, HttpCode, Query, Req } from '@nestjs/common';
import { InstallationsService } from './installations.service';
import { UpdateInstallationDto } from './dto/update-installation.dto';
import { Installation } from './entities/installation.entity';
import { ApiBody, ApiOperation, ApiProperty, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { StatusChangeDto } from './dto/change-status.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesPipe } from 'src/common/pipes/file/files-pipe';
import { QueryOptionsPipe } from 'src/common/pipes/query-options/query-options.pipe';
import { InstallationQueryOptionsDto } from './dto/installation-query-options.dto';
import { Request } from 'express';
import { Roles } from 'src/common/decorators/roles/roles.decorator';

@Controller('installations')
export class InstallationsController {
  constructor(private readonly installationsService: InstallationsService) {}

  @ApiOperation({
    summary: 'taerse todas las intalaciones',
    description: 'no hay que pasarle nada'
  })
  @ApiResponse({
    status: HttpStatus.OK, type: [Installation]
  })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.BAD_REQUEST)
  @Get()
  async getAll() {
    return await this.installationsService.getAll()
  }

  @ApiOperation({
    summary: 'Traer y filtrar instalaciones',
    description: 'este si acepta querys y devuelve resultados paginados'
  })
  @ApiQuery({
    type: InstallationQueryOptionsDto
  })
  @ApiResponse({
    status: HttpStatus.OK, type: [Installation]
  })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.BAD_REQUEST)
  @Get('filter')
  async findAll(
    @Query(new QueryOptionsPipe(InstallationQueryOptionsDto)) query: InstallationQueryOptionsDto,
    @Req() req: Request
  ) {
     const baseUrl = `${req.protocol}://${req.host}${req.path}` + "?" + `${new URLSearchParams(Object.entries(query).map(([k, v]) => [k, String(v)])).toString()}`
    return await this.installationsService.findAll(query, undefined);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
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
  async update(@Param('id') id: string, @Body() data: UpdateInstallationDto , @Req() req: Request){
    const datalog = req.body
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
  @Post(':id/images')
  async loadImages(
    @Param('id') id: string, 
    @UploadedFiles( new FilesPipe(1000, 10000000, ['image/png','image/jpeg',])) files: Express.Multer.File[]) {
    return await this.installationsService.sendToReview(id, files);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.installationsService.remove(id);
  }
}
