import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Province } from './entities/province.entity';
import { DeleteResponse } from 'src/common/entities/delete.response.dto';

@Controller('province')
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}
  @ApiOperation({
    summary: 'create new province'
  })
  @Post()
  create(@Body() createProvinceDto: CreateProvinceDto) {
    return this.provinceService.create(createProvinceDto);
  }
  @ApiOperation({
    summary: 'get all provinces',
  })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  @Get()
  findAll() {
    return this.provinceService.findAll();
  }
  @ApiOperation({
    summary: 'get province by id'
  })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.provinceService.findOne(id);
  }
  @ApiOperation({
    summary: 'province data update'
  })
  @HttpCode(HttpStatus.ACCEPTED)
  @HttpCode(HttpStatus.NOT_FOUND)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProvinceDto: UpdateProvinceDto) {
    return this.provinceService.update(id, updateProvinceDto);
  }

  @ApiOperation({
    summary: 'province soft delete',
  })
  @ApiResponse({
    status: 200, type: DeleteResponse,
  })

  @ApiResponse({
    status: HttpStatus.NOT_FOUND
  })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.provinceService.remove(id);
  }
}
