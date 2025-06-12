import { Module } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Province } from './entities/province.entity';
import { ProvinceRepository } from './province.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Province])],
  providers: [ProvinceService, ProvinceRepository],
  exports: [ProvinceService, ProvinceRepository]
})
export class ProvinceModule {}
