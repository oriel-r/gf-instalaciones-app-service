import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { OrdersModule } from './modules/orders/orders.module';
import { InstalationsModule } from './modules/instalations/instalations.module';
import { CloudinaryService } from './services/cloudinary/cloudinary.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dbConfig } from './config/data-source';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EmailModule } from './modules/email/email.module';
import { NewsletterModule } from './modules/newsletter/newsletter.module';
import { SeedersModule } from './seeders/seeders.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { InstallerModule } from './modules/installer/installer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env.development.local',
      load: [dbConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const config = configService.get<TypeOrmModuleOptions>('postgres');

        if (!config) {
          throw new Error('Database configuration not found');
        }

        return config;
      },
    }),
    UserModule,
    OrdersModule,
    InstalationsModule,
    SeedersModule,
    EmailModule,
    NewsletterModule,
    AuthModule,
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' },
      secret: process.env.JWT_SECRET,
    }),
    InstallerModule,
  ],
  controllers: [AppController],
  providers: [AppService, CloudinaryService],
})
export class AppModule {}

