import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { InstallerModule } from '../installer/installer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/roles.entity';
import { Coordinator } from '../coordinators/entities/coordinator.entity';
import { CoordinatorsModule } from '../coordinators/coordinators.module';


@Module({
  imports:[TypeOrmModule.forFeature([User, Role, Coordinator]), forwardRef(() => InstallerModule), CoordinatorsModule],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService]
})
export class UserModule {}
