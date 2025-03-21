import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdressDto } from './dto/create-adress.dto';
import { UpdateAdressDto } from './dto/update-adress.dto';
import { AdressRepository } from './adress.repository';
import { CityService } from '../city/city.service';
import { ProvinceService } from '../province/province.service';
import { DeepPartial } from 'typeorm';
import { Adress } from './entities/adress.entity';
import { DeleteResponse } from 'src/common/entities/delete.response';
import { AdresResponseDto } from './dto/adress-response.dto';

@Injectable()
export class AdressService {
  constructor(
    private readonly adressesRepository: AdressRepository,
    private readonly citiesService: CityService,
    private readonly provincesService: ProvinceService
  ) {}

  async create(data: CreateAdressDto) {
    const {city, province, ...adress} = data
    const existProvince = await this.provincesService.findOneByName(province)
    if(!existProvince) throw new BadRequestException('Provincia no encontrada o invalida')
    const existCity = await this.citiesService.findOrCreate(city, existProvince)
    return await this.adressesRepository.create({...adress, city: existCity})
  }

  async findAll() {
    const adresses = await this.adressesRepository.get()
    if(!adresses.length) throw new NotFoundException('No se encontraron direcciónes')
      return adresses.map(adress => new AdresResponseDto(adress))
  }

  async findOne(id: string) {
    const adress = await this.adressesRepository.getById(id)
    if(!adress) throw new NotFoundException('No se enconro  la dirección')
      return adress
  }

  async update(id: string, data: DeepPartial<Adress>) {
    const adress = await this.adressesRepository.getById(id)
    if(!adress) throw new NotFoundException('No se enconro la dirección o el id es invalido')
      return await this.adressesRepository.update(id, data)
  }

  async remove(id: string) {
    const adress = await this.adressesRepository.getById(id)
    if(!adress) throw new NotFoundException('No se enconro  la dirección o el id es invalido')
    const result = await this.adressesRepository.softDelete(id)
    if(result.affected) return new DeleteResponse('dirección', id)
  }
}
