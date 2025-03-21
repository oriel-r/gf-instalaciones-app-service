import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { CityRepository } from './city.repository';
import { ProvinceService } from '../province/province.service';
import { DeleteResponse } from 'src/common/entities/delete.response';
import { Province } from '../province/entities/province.entity';
import { DeepPartial } from 'typeorm';
import { City } from './entities/city.entity';

@Injectable()
export class CityService {
  constructor(
    private readonly cityRepository: CityRepository,
    private readonly provinceService: ProvinceService
  ) {}

  async create(createCityDto: CreateCityDto) {
    const {name, province} = createCityDto
    const existCity = await this.cityRepository.getByName(name)
    const existProvince = await this.provinceService.findOneByName(province)
    if(existCity) throw new ConflictException('Esta ciudad ya existe')
    if(!existProvince) throw new BadRequestException('Provincia no existente o mal escrita')
      return await this.cityRepository.create({name, province: existProvince})
  }

  async findOrCreate(name: string, province: Province) {
    const city = await this.cityRepository.getByName(name)
    if(!city || city.province.name !== province.name) {
      const newCity = await this.cityRepository.create({name, province: province})
      return newCity
    }
    return city

  }



  async findAll() {
    const cities = await this.cityRepository.get()
    if(!cities || cities.length === 0) throw new NotFoundException('No se encontraron ciudades')
      return cities
  }

  async findOne(id: string) {
    const city = await this.cityRepository.getById(id)
    if (!city) throw new NotFoundException('Ciudad no encotrada, id invalido o incorrecto')
      return city
  }

  async update(id: string, updateCityDto: DeepPartial<City>) {
    const city = await this.cityRepository.getById(id)
    if (!city) throw new NotFoundException('Ciudad no encotrada, id invalido o incorrecto') 
      return await this.cityRepository.update(id, updateCityDto)
  }

  async softDelete(id: string) {
    const city = await this.cityRepository.getById(id)
    if (!city) throw new NotFoundException('Ciudad no encotrada, id invalido o incorrecto')  
    const result = await this.cityRepository.softDelete(id)
    if(result.affected) return new DeleteResponse('ciudad', id)
    }
}
