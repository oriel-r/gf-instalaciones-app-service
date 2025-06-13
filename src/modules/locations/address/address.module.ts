import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { CityModule } from '../city/city.module';
import { ProvinceModule } from '../province/province.module';
import { AddressRepository } from './address.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Address]), CityModule, ProvinceModule],
  providers: [AddressService, AddressRepository],
  exports: [AddressService, AddressRepository],
})
export class AddressModule {}
