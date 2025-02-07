import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { OrdersModule } from './modules/orders/orders.module';
import { InstalationsModule } from './modules/instalations/instalations.module';
import { CloudinaryService } from './services/cloudinary/cloudinary.service';
import { SeedersModule } from './seeders/seeders.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dbConfig } from './config/data-source';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { sqlitedbConfig } from './config/production-data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env.development.local',
      load: [dbConfig, sqlitedbConfig, () =>({
        enviroment: process.env.ENVIROMENT || "LOCAL",
        }),
      ],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        
        const config = configService.get('enviroment') === "LOCAL"
        ? configService.get<TypeOrmModuleOptions>('postgres')
        : configService.get<TypeOrmModuleOptions>('slite')
        
        if (!config) {
          throw new Error('Database configuration not found');
        }

        return config;
      },
    }),
    UserModule,
    OrdersModule,
    InstalationsModule,
    SeedersModule
  ],
  controllers: [AppController],
  providers: [AppService, CloudinaryService],
})
export class AppModule {}

