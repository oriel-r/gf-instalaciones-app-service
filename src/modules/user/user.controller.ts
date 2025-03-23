import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { FindUserByEmailDto } from './dto/find-user-by-email.dto';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Obtener todos los usuarios activos' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida.', type: [User] })
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @ApiOperation({ summary: 'Buscar usuario por email' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado.', type: User })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @Get('byEmail')
  async findByEmail( @Query() query: FindUserByEmailDto ) {
    return await this.userService.findByEmail(query.email);
  }

  @ApiOperation({ summary: 'Obtener todos los usuarios, incluidos los desactivados' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida.', type: [User] })
  @Get('/findAllWhitDeleted')
  async findAllWhitDeleted() {
    return await this.userService.findAllWhitDeleted();
  }

  @ApiOperation({ summary: 'Buscar usuario desactivado por ID' })
  @ApiResponse({ status: 200, description: 'Usuario desactivado encontrado.', type: User })
  @ApiResponse({ status: 404, description: 'Usuario desactivado no encontrado.' })
  @Get('/findDisabledById/:id')
  async findDisabledUserById(userId: string) {
    return await this.userService.findDisabledUserById(userId);
  }

  @ApiOperation({ summary: 'Buscar usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado.', type: User })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.userService.findById(id);
  }

  @ApiOperation({ summary: 'Actualizar un usuario por ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado correctamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado.',
  })
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.updateUser(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Eliminar un usuario por ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado correctamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado.',
  })
  @Delete(':id')
    async removeUser(@Param('id') id: string) {
    return await this.userService.removeUser(id);
  }

  @ApiOperation({ summary: 'Desactivar usuario (soft delete)' })
  @ApiResponse({ status: 200, description: 'Usuario desactivado correctamente.' })
  @Delete('/disabled/:id')
  async softDeleteUser(@Param('id') id: string) {
    return await this.userService.softDeleteUser(id);
  }

  @ApiOperation({ summary: 'Restaurar usuario desactivado' })
  @ApiResponse({ status: 200, description: 'Usuario restaurado correctamente.' })
  @ApiResponse({ status: 400, description: 'El usuario ya se encuentra activo.' })
  @Put('/restore/:id')
  async restore(@Param('id') id: string) {
    return await this.userService.restore(id);
  }
}
