import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { AdminService } from './admins.service';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { RoleEnum } from 'src/common/enums/user-role.enum';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';

@ApiTags('Admin')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  async findAll() {
    return await this.adminService.findAll();
  }

  @Get('byId/:id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Delete('removeAdmin/:id')
  removeAdminRole(@Param('id') adminId: string) {
    return this.adminService.removeAdminRole(adminId);
  }
}
