import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { CityRepository } from './city.repository';
import { ProvinceModule } from '../province/province.module';
import { ProvinceService } from '../province/province.service';
import { ProvinceRepository } from '../province/province.repository';
import { Province } from '../province/entities/province.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([City]),
    ProvinceModule
  ],
  controllers: [CityController],
  providers: [CityRepository, CityService],
  exports: [CityService, CityRepository]
})
export class CityModule {}
