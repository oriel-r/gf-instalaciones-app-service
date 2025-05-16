import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dbConfig } from './config/data-source';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { BlogModule } from './modules/blog/blog.module';
import { EmailModule } from './modules/email/email.module';
import { NewsletterModule } from './modules/newsletter/newsletter.module';
import { SeedersModule } from './seeders/seeders.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { InstallerModule } from './modules/installer/installer.module';
import { AdminModule } from './modules/admins/admins.module';
import { CoordinatorsModule } from './modules/coordinators/coordinators.module';
import { LocationsModule } from './modules/locations/locations.module';
import { OperationsModule } from './modules/operations/operations.module';
import { ImagesModule } from './modules/images/images.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserRoleModule } from './modules/user-role/user-role.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { NotificationsModule } from './modules/notifications/notifications.module';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local', 'env'],
      load: [dbConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        
        const config = configService.get<TypeOrmModuleOptions>('postgres')
         
        if (!config) {
          throw new Error('Database configuration not found');
        }

        return config;
      },
    }),
    EventEmitterModule.forRoot({
      wildcard: true
    }),
    UserModule,
    SeedersModule,
    BlogModule,
    EmailModule,
    NewsletterModule,
    AuthModule,
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' },
      secret: process.env.JWT_SECRET,
    }),
    InstallerModule,
    AdminModule,
    CoordinatorsModule,
    OperationsModule,
    LocationsModule,
    ImagesModule,
    UserRoleModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

