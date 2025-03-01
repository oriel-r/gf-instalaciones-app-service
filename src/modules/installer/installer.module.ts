import { forwardRef, Module } from '@nestjs/common';
import { InstallerController } from './installer.controller';
import { InstallerService } from './installer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Installer } from './entities/installer.entity';
import { UserModule } from '../user/user.module';
import { Role } from '../user/entities/roles.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Installer, Role]), forwardRef(() => UserModule)],
  controllers: [InstallerController],
  providers: [InstallerService],
  exports: [InstallerService]
})
export class InstallerModule {}
