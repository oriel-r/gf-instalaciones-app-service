import { forwardRef, Module } from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { UserRoleController } from './user-role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from './entities/user-role.entity';
import { UserModule } from '../user/user.module';
import { Role } from '../user/entities/roles.entity';
import { User } from '../user/entities/user.entity';
import { Installer } from '../installer/entities/installer.entity';
import { AdminModule } from '../admins/admins.module';
import { CoordinatorsModule } from '../coordinators/coordinators.module';
import { AdminService } from '../admins/admins.service';
import { InstallerModule } from '../installer/installer.module';
import { Admin } from '../admins/entities/admins.entity';
import { CoordinatorsService } from '../coordinators/coordinators.service';
import { Coordinator } from '../coordinators/entities/coordinator.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserRole, Role, User, Installer, Admin, Coordinator]),
    forwardRef(() => UserModule),
    forwardRef(() => AdminModule), 
    forwardRef(() => InstallerModule), 
    forwardRef(() => CoordinatorsModule),
    ],
  providers: [UserRoleService],
  controllers: [UserRoleController],
  exports: [UserRoleService]
})
export class UserRoleModule {}
