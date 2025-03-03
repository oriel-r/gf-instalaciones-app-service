import { Module } from '@nestjs/common';
import { AdminService } from './admins.service';
import { AdminController } from './admins.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { Admin } from './entities/admins.entity';
import { Role } from '../user/entities/roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, User, Role]), UserModule],
  controllers: [AdminController],
  providers: [AdminService], 
})
export class AdminModule {}
