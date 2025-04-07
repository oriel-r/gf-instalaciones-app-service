import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { AssignRoleDto } from './dto/assign-role.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('user-role')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Post('assign-role')
  async assignRole(@Body() assignRoleDto: AssignRoleDto) {
    const { userId, roleId } = assignRoleDto;
    return this.userRoleService.assignRole(userId, roleId);
  }

  @ApiOperation({ summary: 'Buscar usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado.'})
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @Get(':id')
  async findUserRoleById(@Param('id') id: string) {
    return await this.userRoleService.findUserRoleById(id)
  }
}
