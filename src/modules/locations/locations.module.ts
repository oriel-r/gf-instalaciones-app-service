import { Module } from '@nestjs/common';
import { ProvinceModule } from './province/province.module';
import { CityModule } from './city/city.module';
import { AddressModule } from './address/address.module';

@Module({
  imports: [ProvinceModule, CityModule, AddressModule],
  exports: [ProvinceModule, CityModule, AddressModule],
})
export class LocationsModule {}
