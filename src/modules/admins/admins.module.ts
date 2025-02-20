import { Module } from '@nestjs/common';
import { AdminService } from './admins.service';
import { AdminController } from './admins.controller';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
