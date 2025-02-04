import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InstalationsService } from './instalations.service';
import { CreateInstalationDto } from './dto/create-instalation.dto';
import { UpdateInstalationDto } from './dto/update-instalation.dto';

@Controller('instalations')
export class InstalationsController {
  constructor(private readonly instalationsService: InstalationsService) {}

  @Post()
  create(@Body() createInstalationDto: CreateInstalationDto) {
    return this.instalationsService.create(createInstalationDto);
  }

  @Get()
  findAll() {
    return this.instalationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.instalationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInstalationDto: UpdateInstalationDto) {
    return this.instalationsService.update(+id, updateInstalationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.instalationsService.remove(+id);
  }
}
