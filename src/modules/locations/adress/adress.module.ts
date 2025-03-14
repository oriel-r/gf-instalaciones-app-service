import { Module } from '@nestjs/common';
import { AdressService } from './adress.service';
import { AdressController } from './adress.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Adress } from './entities/adress.entity';
import { CityModule } from '../city/city.module';
import { ProvinceModule } from '../province/province.module';
import { AdressRepository } from './adress.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Adress]),
    CityModule, ProvinceModule
  ],
  controllers: [AdressController],
  providers: [AdressService, AdressRepository],
  exports: [AdressService, AdressRepository]
})
export class AdressModule {}
