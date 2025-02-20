import { Module } from '@nestjs/common';
import { CoordinatorsService } from './coordinators.service';
import { CoordinatorsController } from './coordinators.controller';

@Module({
  controllers: [CoordinatorsController],
  providers: [CoordinatorsService],
})
export class CoordinatorsModule {}
