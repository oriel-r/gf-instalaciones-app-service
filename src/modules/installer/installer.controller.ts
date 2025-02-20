import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { InstallerService } from './installer.service';
import { CreateInstallerDto } from './dto/create-installer.dto';

@Controller('installer')
export class InstallerController {
  constructor(private readonly installerService: InstallerService) {}

  @Get()
  async findAll() {
    return await this.installerService.findAll();
  }

  @Post()
  async createInstaller(@Body() installerDto: CreateInstallerDto) {
    return await this.installerService.createInstaller(installerDto);
  }

  @Delete('/disabled/:id')
  async softDelete(@Param('id') id: string) {
    return await this.installerService.softDelete(id);
  }

  @Put('/restore/:id')
  async restore(@Param('id') id: string) {
    return await this.installerService.restore(id);
  }

  @Get('/findAllWhitDeleted')
  async findAllWhitDeleted() {
    return await this.installerService.findAllWhitDeleted();
  }

  @Get('/findDisabledById/:id')
  async findDisabledInstallerById(installerId: string) {
    return await this.installerService.findDisabledInstallerById(installerId);
  }
}
