import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.', type: User })
  @ApiResponse({ status: 409, description: 'Conflicto: email o identificación duplicados.' })
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @ApiOperation({ summary: 'Obtener todos los usuarios activos' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida.', type: [User] })
  @Get()
  findAll() {
    return this.userService.findAll();
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
    remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @ApiOperation({ summary: 'Buscar usuario por email' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado.', type: User })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiBody({ schema: { properties: { email: { type: 'string', example: 'example@email.com' } } } })
  @Get('byEmail')
  async findByEmail(@Body('email') email: string) {
    try {
      const user = await this.userService.findByEmail(email);

      if (!user)
        throw new NotFoundException(
          `No se encontro el usuario con el email: ${email}`,
        );
      return user;
    } catch (error) {
      throw new NotFoundException(`No se encontro el usuario`);
    }
  }

  @ApiOperation({ summary: 'Desactivar usuario (soft delete)' })
  @ApiResponse({ status: 200, description: 'Usuario desactivado correctamente.' })
  @Delete('/disabled/:id')
  async softDelete(@Param('id') id: string) {
    return await this.userService.softDelete(id);
  }

  @ApiOperation({ summary: 'Restaurar usuario desactivado' })
  @ApiResponse({ status: 200, description: 'Usuario restaurado correctamente.' })
  @ApiResponse({ status: 400, description: 'El usuario ya se encuentra activo.' })
  @Put('/restore/:id')
  async restore(@Param('id') id: string) {
    return await this.userService.restore(id);
  }
}
