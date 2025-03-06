import { Module } from '@nestjs/common';
import { InstalationsModule } from './instalations/instalations.module';
import { OrdersModule } from './orders/orders.module';

@Module({
    imports: [InstalationsModule, OrdersModule],
    exports: [InstalationsModule, OrdersModule]
})
export class OperationsModule {}
