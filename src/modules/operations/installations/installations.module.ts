import { Module } from '@nestjs/common';
import { InstallationsService } from './installations.service';
import { InstallationsController } from './installations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Installation } from './entities/installation.entity';
import { AdressModule } from 'src/modules/locations/adress/adress.module';
import { InstallationsRepository } from './installations.repository';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Installation]),
    AdressModule
  ],
  controllers: [InstallationsController],
  providers: [InstallationsService, InstallationsRepository, FileUploadService],
  exports: [InstallationsService, InstallationsRepository]
})
export class InstallationsModule {}
