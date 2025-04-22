import { Module } from '@nestjs/common';
import { InstallationsService } from './installations.service';
import { InstallationsController } from './installations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Installation } from './entities/installation.entity';
import { AddressModule } from 'src/modules/locations/address/address.module';
import { InstallationsRepository } from './installations.repository';
import { UserRoleModule } from 'src/modules/user-role/user-role.module';
import { InstallerModule } from 'src/modules/installer/installer.module';
import { ImagesModule } from 'src/modules/images/images.module';
import { TemporalUploadService } from 'src/services/temporal-file-upload/temporal-file-upload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Installation]),
    AddressModule,
    UserRoleModule,
    InstallerModule,
    ImagesModule
  ],
  controllers: [InstallationsController],
  providers: [InstallationsService, InstallationsRepository, FileUploadService, TemporalUploadService],
  exports: [InstallationsService, InstallationsRepository]
})
export class InstallationsModule {}
