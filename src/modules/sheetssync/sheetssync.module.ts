import { Module } from '@nestjs/common';
import { SheetssyncService } from './sheetssync.service';

@Module({
  providers: [SheetssyncService],
})
export class SheetssyncModule {}
