import { Controller, Get, Param, Delete, Put } from '@nestjs/common';
import { AdminService } from './admins.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Put('assignAdmin/:id')
  async assignAdmin(@Param('id') adminId: string) {
    return await this.adminService.assignAdmin(adminId);
  }

  @Get()
  async findAll() {
    return await this.adminService.findAll();
  }

  @Get('findById/:id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Delete('removeAdmin/:id')
  removeAdminRole(@Param('id') adminId: string) {
    return this.adminService.removeAdminRole(adminId);
  }
}
