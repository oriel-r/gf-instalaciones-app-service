import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrdersRepository } from './orders.repository';
import { InstallationsModule } from '../installations/installations.module';
import { UserRoleModule } from 'src/modules/user-role/user-role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    InstallationsModule,
    UserRoleModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
  exports: [OrdersService, OrdersRepository]
})
export class OrdersModule {}
