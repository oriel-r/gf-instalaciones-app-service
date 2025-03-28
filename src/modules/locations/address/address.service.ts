import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressRepository } from './address.repository';
import { CityService } from '../city/city.service';
import { ProvinceService } from '../province/province.service';
import { DeepPartial } from 'typeorm';
import { Address } from './entities/address.entity';
import { DeleteResponse } from 'src/common/entities/delete.response.dto';
import { AddressResponseDto } from './dto/address-response.dto';

@Injectable()
export class AddressService {
  constructor(
    private readonly addressesRepository: AddressRepository,
    private readonly citiesService: CityService,
    private readonly provincesService: ProvinceService
  ) {}

  async create(data: CreateAddressDto) {
    const {city, province, ...address} = data
    const existProvince = await this.provincesService.findOneByName(province)
    if(!existProvince) throw new BadRequestException('Provincia no encontrada o invalida')
    const existCity = await this.citiesService.findOrCreate(city, existProvince)
    return await this.addressesRepository.create({...address, city: existCity})
  }

  async findAll() {
    const Addresses = await this.addressesRepository.get()
    if(!Addresses.length) throw new NotFoundException('No se encontraron direcciónes')
      return Addresses.map(Address => new AddressResponseDto(Address))
  }

  async findOne(id: string) {
    const Address = await this.addressesRepository.getById(id)
    if(!Address) throw new NotFoundException('No se enconro  la dirección')
      return Address
  }

  async update(id: string, data: DeepPartial<Address>) {
    const Address = await this.addressesRepository.getById(id)
    if(!Address) throw new NotFoundException('No se enconro la dirección o el id es invalido')
      return await this.addressesRepository.update(id, data)
  }

  async remove(id: string) {
    const Address = await this.addressesRepository.getById(id)
    if(!Address) throw new NotFoundException('No se enconro  la dirección o el id es invalido')
    const result = await this.addressesRepository.softDelete(id)
    if(result.affected) return new DeleteResponse('dirección', id)
  }
}
