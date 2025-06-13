import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { CityRepository } from './city.repository';
import { ProvinceModule } from '../province/province.module';

@Module({
  imports: [TypeOrmModule.forFeature([City]), ProvinceModule],
  providers: [CityRepository, CityService],
  exports: [CityService, CityRepository],
})
export class CityModule {}
