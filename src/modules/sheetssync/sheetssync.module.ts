import { Module } from '@nestjs/common';
import { SheetssyncService } from './sheetssync.service';
import { SheetssyncController } from './sheetssync.controller';
import { OrdersService } from '../operations/orders/orders.service';
import { InstallationsService } from '../operations/installations/installations.service';

@Module({
  controllers: [SheetssyncController],
  providers: [SheetssyncService],
})
export class SheetssyncModule {}
