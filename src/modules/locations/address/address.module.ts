import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address} from './entities/address.entity';
import { CityModule } from '../city/city.module';
import { ProvinceModule } from '../province/province.module';
import { AddressRepository } from './address.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Address]),
    CityModule, ProvinceModule
  ],
  controllers: [AddressController],
  providers: [AddressService, AddressRepository],
  exports: [AddressService, AddressRepository]
})
export class AddressModule {}
