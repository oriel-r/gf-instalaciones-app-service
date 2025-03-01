import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { InstallerService } from './installer.service';
import { CreateInstallerDto } from './dto/create-installer.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Installer } from './entities/installer.entity';
import { FindUserByEmailDto } from '../user/dto/find-user-by-email.dto';

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

   @ApiOperation({ summary: 'Buscar instalador por email' })
    @ApiResponse({ status: 200, description: 'Instalador encontrado.', type: Installer })
    @ApiResponse({ status: 404, description: 'Instalador no encontrado.' })
    @Get('byEmail')
    async findByEmail( @Query() query: FindUserByEmailDto ) {
      try {
        const user = await this.installerService.findByEmail(query.email);
  
        if (!user)
          throw new NotFoundException(
            `No se encontro el usuario instalador con el email: ${query.email}`,
          );
        return user;
      } catch (error) {
        throw new NotFoundException(`No se encontro el usuario instalador`);
      }
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

  @ApiOperation({ summary: 'Obtener todos los instaladores, incluyendo los eliminados' })
  @ApiResponse({
    status: 200,
    description: 'Lista de instaladores, incluyendo los eliminados',
    type: [Installer],
  })
  @Get('/findAllWhitDeleted')
  async findAllWithDeleted() {
    return await this.installerService.findAllWithDeleted();
  }

  @ApiOperation({ summary: 'Deshabilitar un instalador' })
  @ApiResponse({
    status: 200,
    description: 'El instalador ha sido deshabilitado correctamente',
  })
  @Delete('/disabled/:id')
  async softDelete(@Param('id') id: string) {
    return await this.installerService.softDelete(id);
  }

  @ApiOperation({ summary: 'Restaurar un instalador deshabilitado' })
  @ApiResponse({
    status: 200,
    description: 'El instalador ha sido restaurado correctamente',
  })
  @Put('/restore/:id')
  async restore(@Param('id') id: string) {
    return await this.installerService.restore(id);
  }

  @ApiOperation({ summary: 'Buscar un instalador deshabilitado por ID' })
  @ApiResponse({
    status: 200,
    description: 'Detalles del instalador deshabilitado',
    type: Installer,
  })
  @ApiResponse({
    status: 404,
    description: 'Instalador deshabilitado no encontrado',
  })
  @Get('/findDisabledById/:id')
  async findDisabledInstallerById(@Param('id') installerId: string) {
    return await this.installerService.findDisabledInstallerById(installerId);
  }
}
