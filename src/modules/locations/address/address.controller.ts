import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Address } from './entities/address.entity';
import { DeepPartial } from 'typeorm';
import { DeleteResponse } from 'src/common/entities/delete.response.dto';

@Controller('Address')
export class AddressController {
  constructor(private readonly AddressService: AddressService) {}

  @ApiOperation({
    summary: 'Create new Address',
    description: 'send the city and the province name, if the city isnt loaded in db it is created'
  })
  @ApiResponse({
    status: HttpStatus.CREATED, type: Address
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND
  })
  @HttpCode(HttpStatus.CREATED)
  @HttpCode(HttpStatus.NOT_FOUND)
  @Post()
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.AddressService.create(createAddressDto);
  }

  @ApiOperation({
    summary: "get all Addresses loaded"
  })
  @ApiResponse({
    status: HttpStatus.OK, type: [Address]
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND
  })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  @Get()
  findAll() {
    return this.AddressService.findAll();
  }

  @ApiOperation({
    summary: "get an Address"
  })
  @ApiResponse({
    status: HttpStatus.OK, type: Address
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND
  })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.AddressService.findOne(id);
  }

  @ApiOperation({
    summary: "update an Address info"
  })
  @ApiResponse({
    status: HttpStatus.OK, type: Address
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND
  })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: DeepPartial<CreateAddressDto>) {
    return this.AddressService.update(id, updateAddressDto);
  }

  @ApiOperation({
    summary: "Soft remove an Address"
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
    return this.AddressService.remove(id);
  }
  
}
