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
import { AdminModule } from '../admins/admins.module';
import { CoordinatorsModule } from '../coordinators/coordinators.module';
import { CoordinatorsService } from '../coordinators/coordinators.service';
import { Coordinator } from '../coordinators/entities/coordinator.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Installer, Role, User, UserRole, Coordinator]), 
  forwardRef(() => UserModule),
   UserRoleModule,
   AdminModule,
   CoordinatorsModule
  ],
  controllers: [InstallerController],
  providers: [InstallerService, UserRoleService, CoordinatorsService],
  exports: [InstallerService]
})
export class InstallerModule {}
