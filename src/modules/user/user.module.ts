import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { InstallerModule } from '../installer/installer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Coordinator } from '../coordinators/entities/coordinator.entity';


@Module({
  imports:[TypeOrmModule.forFeature([User, Coordinator]), forwardRef(() => InstallerModule)],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService]
})
export class UserModule {}
