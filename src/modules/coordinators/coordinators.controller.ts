import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CoordinatorsService } from './coordinators.service';
import { UpdateCoordinatorDto } from './dto/update-coordinator.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { RoleEnum } from 'src/common/enums/user-role.enum';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';

@UseGuards(AuthGuard, RolesGuard)
@ApiTags('Coordinators')
@Controller('coordinators')
export class CoordinatorsController {
  constructor(private readonly coordinatorsService: CoordinatorsService) {}

  @Get()
  @Roles(RoleEnum.ADMIN)
  async getAll() {
    return await this.coordinatorsService.getAll();
  }

  @Patch(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.COORDINATOR)
  update(
    @Param('id') id: string,
    @Body() updateCoordinatorDto: UpdateCoordinatorDto,
  ) {
    return this.coordinatorsService.update(+id, updateCoordinatorDto);
  }

  @Get(':id')
  @Roles(RoleEnum.ADMIN)
  async findById(@Param('id') id: string) {
    return await this.coordinatorsService.findById(id);
  }
}
