import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { InstallerModule } from '../installer/installer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/roles.entity';
import { UserRole } from '../user-role/entities/user-role.entity';
import { UserRoleModule } from '../user-role/user-role.module';


@Module({
  imports:[TypeOrmModule.forFeature([User, Role, UserRole]), 
  forwardRef(() => InstallerModule), 
  forwardRef(() => UserRoleModule)
],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService]
})
export class UserModule {}
