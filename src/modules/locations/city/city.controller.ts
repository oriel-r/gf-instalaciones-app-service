import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { ApiResponse, ApiOperation} from '@nestjs/swagger';
import { City } from './entities/city.entity';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}
  
  @ApiOperation({
    summary: 'create a city'
  })
  @ApiResponse({
    status: HttpStatus.CREATED
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT
  })
  @HttpCode(HttpStatus.CREATED)
  @HttpCode(HttpStatus.CONFLICT)
  @Post()
  create(@Body() createCityDto: CreateCityDto) {
    return this.cityService.create(createCityDto);
  }

  @ApiOperation({
    summary: 'get all cities'
  })
  @ApiResponse({
    status: 200, type: [City]
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND
  })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  @Get()
  findAll() {
    return this.cityService.findAll();
  }

  @ApiOperation({
    summary: 'get a city by id'
  })
  @ApiResponse({
    status: HttpStatus.OK, type: City
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND
  })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cityService.findOne(id);
  }

  @ApiOperation({
    summary: 'update a city info'
  })
  @ApiResponse({
    status: HttpStatus.OK
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND
  })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.cityService.update(id, updateCityDto);
  }

  @ApiOperation({
    summary: 'Soft delete a city'
  })
  @ApiResponse({
    status: HttpStatus.OK
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND
  })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cityService.softDelete(id);
  }

}
