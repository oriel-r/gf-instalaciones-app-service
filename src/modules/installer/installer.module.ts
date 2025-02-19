import { forwardRef, Module } from '@nestjs/common';
import { InstallerController } from './installer.controller';
import { InstallerService } from './installer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Installer } from './entities/installer.entity';
import { UserModule } from '../user/user.module';


@Module({
  imports: [TypeOrmModule.forFeature([Installer]), forwardRef(() => UserModule)],
  controllers: [InstallerController],
  providers: [InstallerService],
  exports: [InstallerService]
})
export class InstallerModule {}
