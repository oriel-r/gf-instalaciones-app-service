import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrdersRepository } from './orders.repository';
import { InstallationsModule } from '../installations/installations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    InstallationsModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
