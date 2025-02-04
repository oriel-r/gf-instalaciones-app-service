import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { OrdersModule } from './modules/orders/orders.module';
import { InstalationsModule } from './modules/instalations/instalations.module';
import { CloudinaryService } from './services/cloudinary/cloudinary.service';
import { Module } from './seeders/seeders/.module';
import { SeedersModule } from './src/seeders/seeders.module';
import { SeedersModule } from './seeders/seeders.module';

@Module({
  imports: [UserModule, OrdersModule, InstalationsModule, Module, SeedersModule],
  controllers: [AppController],
  providers: [AppService, CloudinaryService],
})
export class AppModule {}
