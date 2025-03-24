import { forwardRef, Module } from '@nestjs/common';
import { InstallerController } from './installer.controller';
import { InstallerService } from './installer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Installer } from './entities/installer.entity';
import { UserModule } from '../user/user.module';
import { Role } from '../user/entities/roles.entity';
import { User } from '../user/entities/user.entity';
import { UserRoleModule } from '../user-role/user-role.module';
import { UserRoleService } from '../user-role/user-role.service';
import { UserRole } from '../user-role/entities/user-role.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Installer, Role, User, UserRole]), forwardRef(() => UserModule), UserRoleModule],
  controllers: [InstallerController],
  providers: [InstallerService, UserRoleService],
  exports: [InstallerService]
})
export class InstallerModule {}
