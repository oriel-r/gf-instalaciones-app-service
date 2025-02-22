import { Module } from '@nestjs/common';
import { CoordinatorsService } from './coordinators.service';
import { CoordinatorsController } from './coordinators.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coordinator } from './entities/coordinator.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coordinator, User])],
  controllers: [CoordinatorsController],
  providers: [CoordinatorsService],
})
export class CoordinatorsModule {}
