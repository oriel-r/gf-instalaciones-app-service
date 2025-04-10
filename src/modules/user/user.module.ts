import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { InstallerModule } from '../installer/installer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/roles.entity';
import { UserRole } from '../user-role/entities/user-role.entity';
import { UserRoleModule } from '../user-role/user-role.module';
import { Coordinator } from '../coordinators/entities/coordinator.entity';
import { CoordinatorsModule } from '../coordinators/coordinators.module';
import { CoordinatorsService } from '../coordinators/coordinators.service';


@Module({
  imports:[TypeOrmModule.forFeature([User, Role, UserRole, Coordinator]), 
  forwardRef(() => InstallerModule), 
  forwardRef(() => UserRoleModule),
  CoordinatorsModule
],
  controllers: [UserController],
  providers: [UserService, CoordinatorsService],
  exports:[UserService]
})
export class UserModule {}
