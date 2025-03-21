import { Module } from '@nestjs/common';
import { InstallationsModule } from './installations/installations.module';
import { OrdersModule } from './orders/orders.module';

@Module({
    imports: [InstallationsModule, OrdersModule],
    exports: [InstallationsModule, OrdersModule]
})
export class OperationsModule {}
