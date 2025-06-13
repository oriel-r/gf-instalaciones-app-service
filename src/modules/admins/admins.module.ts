import { forwardRef, Module } from '@nestjs/common';
import { AdminService } from './admins.service';
import { AdminController } from './admins.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { Admin } from './entities/admins.entity';
import { Role } from '../user/entities/roles.entity';
import { UserRole } from '../user-role/entities/user-role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, User, Role, UserRole]),
    forwardRef(() => UserModule),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
