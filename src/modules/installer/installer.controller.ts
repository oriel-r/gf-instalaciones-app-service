import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InstallerService } from './installer.service';
import { CreateInstallerDto } from './dto/create-installer.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Installer } from './entities/installer.entity';
import { UpdateInstallerDto } from './dto/update-installer';

@ApiTags('Installer')
@Controller('installer')
export class InstallerController {
  constructor(private readonly installerService: InstallerService) {}
 
  @ApiOperation({ summary: 'Obtener todos los instaladores' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos los instaladores',
    type: [Installer],
  })
  @Get()
  async findAll() {
    return await this.installerService.findAll();
  }

  @ApiOperation({ summary: 'Crear un nuevo instalador' })
  @ApiResponse({
    status: 201,
    description: 'El instalador ha sido creado exitosamente',
    type: Installer,
  })
  @Post()
  async createInstaller(@Body() installerDto: CreateInstallerDto) {
    return await this.installerService.createInstaller(installerDto);
  }

  @Patch(':id')
  async updateInstaller(
    @Body() updateInstaller: UpdateInstallerDto,
    @Param('id') id: string,
  ) {
    return await this.installerService.updateInstaller(updateInstaller, id);
  }

  @ApiOperation({ summary: 'Deshabilitar un instalador' })
  @ApiResponse({
    status: 200,
    description: 'El instalador ha sido deshabilitado correctamente',
  })
  @Delete('disabled/:id')
  async disable(@Param('id') id: string) {
    return await this.installerService.disable(id);
  }

   @ApiOperation({ summary: 'Restaurar un instalador deshabilitado' })
  @ApiResponse({
    status: 200,
    description: 'El instalador ha sido restaurado correctamente',
  })
  @Put('restore/:id')
  async restore(@Param('id') id: string) {
    return await this.installerService.restore(id);
  }

  @ApiOperation({ summary: 'Buscar instalador por ID' })
  @ApiResponse({
    status: 200,
    description: 'Instalador encontrado.',
    type: Installer,
  })
  @ApiResponse({ status: 404, description: 'Instalador no encontrado.' })
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.installerService.findById(id);
  }
}
