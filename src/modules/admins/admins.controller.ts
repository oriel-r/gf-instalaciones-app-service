import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { AdminService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
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

  @Put('assignCoordinator/:id')
  async assignCoordinator(@Param('id') coordinatorId: string) {
    return await this.adminService.assignCoordinator(coordinatorId);
  }
}
