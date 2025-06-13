import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoleModule } from '../user-role/user-role.module';
import { Notification } from './entities/notification.entity';
import { NotificationsRepository } from './notifications.repository';
import { EmailModule } from '../email/email.module';
import { OrdersModule } from '../operations/orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    UserRoleModule,
    EmailModule,
    OrdersModule,
  ],
  providers: [NotificationsService, NotificationsRepository],
})
export class NotificationsModule {}
