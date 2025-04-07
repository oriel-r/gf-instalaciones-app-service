import { forwardRef, Module } from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { UserRoleController } from './user-role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from './entities/user-role.entity';
import { UserModule } from '../user/user.module';
import { Role } from '../user/entities/roles.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { Installer } from '../installer/entities/installer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserRole, Role, User, Installer]),
   forwardRef(() => UserModule)
  ],
  providers: [UserRoleService],
  controllers: [UserRoleController],
  exports: [UserRoleService]
})
export class UserRoleModule {}
