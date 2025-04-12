import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressRepository } from './address.repository';
import { CityService } from '../city/city.service';
import { ProvinceService } from '../province/province.service';
import { DeepPartial } from 'typeorm';
import { Address } from './entities/address.entity';
import { DeleteResponse } from 'src/common/entities/delete.response.dto';
import { AddressResponseDto } from './dto/address-response.dto';
import { City } from '../city/entities/city.entity';
import { Province } from '../province/entities/province.entity';

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

  async update(id: string, data: DeepPartial<CreateAddressDto>) {
    const address = await this.addressesRepository.getById(id);
    if (!address) {
      throw new NotFoundException('No se encontró la dirección o el ID es inválido');
    }
  
    const { city, province, ...otherFields } = data;
    let updatedCity = address.city;
  
    if (city || province) {
      const provinceToUse = province
        ? await this.provincesService.findOneByName(province)
        : address.city.province;
  
      if (!provinceToUse) {
        throw new NotFoundException('Provincia no encontrada');
      }

      const cityNameToUse = city ?? address.city.name;
  
      updatedCity = await this.citiesService.findOrCreate(cityNameToUse, provinceToUse);
    }
  
    const updatedData: DeepPartial<Address> = {
      ...otherFields,
      city: updatedCity,
    };
  
    const result = await this.addressesRepository.update(id, updatedData);
    if(!result.affected) throw new InternalServerErrorException('Error desconcodio al itnetnar actulizar la dirección')
      return await this.addressesRepository.getById(id)
  }

  async remove(id: string) {
    const Address = await this.addressesRepository.getById(id)
    if(!Address) throw new NotFoundException('No se enconro  la dirección o el id es invalido')
    const result = await this.addressesRepository.softDelete(id)
    if(result.affected) return new DeleteResponse('dirección', id)
  }
}
