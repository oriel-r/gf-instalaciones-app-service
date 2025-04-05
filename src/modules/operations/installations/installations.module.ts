import { Module } from '@nestjs/common';
import { InstallationsService } from './installations.service';
import { InstallationsController } from './installations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Installation } from './entities/installation.entity';
import { AddressModule } from 'src/modules/locations/address/address.module';
import { InstallationsRepository } from './installations.repository';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { UserRoleService } from 'src/modules/user-role/user-role.service';
import { UserRoleModule } from 'src/modules/user-role/user-role.module';
import { InstallerModule } from 'src/modules/installer/installer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Installation]),
    AddressModule,
    UserRoleModule,
    InstallerModule
  ],
  controllers: [InstallationsController],
  providers: [InstallationsService, InstallationsRepository, FileUploadService],
  exports: [InstallationsService, InstallationsRepository]
})
export class InstallationsModule {}
