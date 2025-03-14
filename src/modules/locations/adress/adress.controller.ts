import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { AdressService } from './adress.service';
import { CreateAdressDto } from './dto/create-adress.dto';
import { UpdateAdressDto } from './dto/update-adress.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Adress } from './entities/adress.entity';
import { DeepPartial } from 'typeorm';
import { DeleteResponse } from 'src/common/entities/delete.response';

@Controller('adress')
export class AdressController {
  constructor(private readonly adressService: AdressService) {}

  @ApiOperation({
    summary: 'Create new adress',
    description: 'send the city and the province name, if the city isnt loaded in db it is created'
  })
  @ApiResponse({
    status: HttpStatus.CREATED, type: Adress
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND
  })
  @HttpCode(HttpStatus.CREATED)
  @HttpCode(HttpStatus.NOT_FOUND)
  @Post()
  create(@Body() createAdressDto: CreateAdressDto) {
    return this.adressService.create(createAdressDto);
  }

  @ApiOperation({
    summary: "get all adresses loaded"
  })
  @ApiResponse({
    status: HttpStatus.OK, type: [Adress]
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND
  })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  @Get()
  findAll() {
    return this.adressService.findAll();
  }

  @ApiOperation({
    summary: "get an adress"
  })
  @ApiResponse({
    status: HttpStatus.OK, type: Adress
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND
  })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adressService.findOne(id);
  }

  @ApiOperation({
    summary: "update an adress info"
  })
  @ApiResponse({
    status: HttpStatus.OK, type: Adress
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND
  })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdressDto: DeepPartial<Adress>) {
    return this.adressService.update(id, updateAdressDto);
  }

  @ApiOperation({
    summary: "Soft remove an adress"
  })
  @ApiResponse({
    status: HttpStatus.OK, type: DeleteResponse
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND
  })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adressService.remove(id);
  }
  
}
