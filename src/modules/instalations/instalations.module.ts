import { Module } from '@nestjs/common';
import { InstalationsService } from './instalations.service';
import { InstalationsController } from './instalations.controller';

@Module({
  controllers: [InstalationsController],
  providers: [InstalationsService],
})
export class InstalationsModule {}
