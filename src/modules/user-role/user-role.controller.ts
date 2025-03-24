import { Controller, Post, Body } from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { AssignRoleDto } from './dto/assign-role.dto';

@Controller('user-role')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Post('assign-role')
  async assignRole(@Body() assignRoleDto: AssignRoleDto) {
    const { userId, roleId } = assignRoleDto;
    return this.userRoleService.assignRole(userId, roleId);
  }
}

