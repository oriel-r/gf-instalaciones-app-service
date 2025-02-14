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
import { sqlitedbConfig } from './config/sqlite-data-source';
import { BlogPostTamplatesModule } from './modules/blog-post-tamplates/blog-post-tamplates.module';
import { BlogPostsModule } from './modules/blog-posts/blog-posts.module';
import { BlogCategoriesModule } from './modules/blog-categories/blog-categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local', 'env'],
      load: [dbConfig, sqlitedbConfig, () =>({
        environment: process.env.ENVIRONMENT || "LOCAL",

        }),
      ],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        
        const config = configService.get('environment') === "LOCAL"
        ? configService.get<TypeOrmModuleOptions>('postgres')
        : configService.get<TypeOrmModuleOptions>('sqlite')
        
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
    BlogPostTamplatesModule,
    BlogPostsModule,
    BlogCategoriesModule
  ],
  controllers: [AppController],
  providers: [AppService, CloudinaryService],
})
export class AppModule {}

