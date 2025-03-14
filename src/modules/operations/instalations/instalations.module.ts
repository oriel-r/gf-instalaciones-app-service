import { Module } from '@nestjs/common';
import { InstalationsService } from './instalations.service';
import { InstalationsController } from './instalations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instalation } from './entities/instalation.entity';
import { AdressModule } from 'src/modules/locations/adress/adress.module';
import { InstalationsRepository } from './instalarion.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Instalation]),
    AdressModule
  ],
  controllers: [InstalationsController],
  providers: [InstalationsService, InstalationsRepository],
  exports: [InstalationsService, InstalationsRepository]
})
export class InstalationsModule {}
