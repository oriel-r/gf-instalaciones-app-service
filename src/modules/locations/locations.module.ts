import { Module } from '@nestjs/common';
import { ProvinceModule } from './province/province.module';
import { CityModule } from './city/city.module';
import { AdressModule } from './adress/adress.module';

@Module({
    imports: [ProvinceModule, CityModule, AdressModule],
    exports: [ProvinceModule, CityModule, AdressModule]
})
export class LocationsModule {}
