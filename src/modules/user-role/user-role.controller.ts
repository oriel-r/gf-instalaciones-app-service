import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { AssignRoleDto } from './dto/assign-role.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('user-role')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Get()
  async getAll() {
    return await this.userRoleService.findAll();
  }

  @Post('assign-role')
  async assignRole(@Body() assignRoleDto: AssignRoleDto) {
    const { userId, roleId } = assignRoleDto;
    return this.userRoleService.assignRole(userId, roleId);
  }

  @ApiOperation({ summary: 'Buscar usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @Get(':id')
  async findUserRoleById(@Param('id') id: string) {
    return await this.userRoleService.findUserRoleById(id);
  }

  @Delete(':userId/:roleId')
  async removeRole(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ) {
    return await this.userRoleService.removeRole(userId, roleId);
  }
}
