import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import swaggerConfig from './config/documentation';
import { loggerMiddleware } from './common/helpers/logger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { UserSeeds } from './seeders/users/user.seeds';
import { DateFormatInterceptor } from './common/interceptors/date-format.interceptor';
import { BlogCategoriesSeeder } from './seeders/blog/blog-categories.seeder';
import { BlogTemplatesSeeder } from './seeders/blog/blog-templates.seeder';
import { BlogPostsSeeder } from './seeders/blog/blog-posts.seeder';
import { LocationsSeeder } from './seeders/locations/locations.seeds';
import { OrdersSeeder } from './seeders/orders/orders.seeds';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  app.use(loggerMiddleware)
  
  app.enableCors()
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  app.useGlobalFilters(new HttpExceptionFilter());
  
  app.useGlobalInterceptors(new DateFormatInterceptor());
  
  const usersSeed = app.get(UserSeeds);
  await usersSeed.seed();
  
  const categoriesSeeder = app.get(BlogCategoriesSeeder)
  await categoriesSeeder.seed()
  
  const templatesSeeder = app.get(BlogTemplatesSeeder)
  await templatesSeeder.seed()
  
  const postsSeeder = app.get(BlogPostsSeeder)
  await postsSeeder.seed()
  
  const locationSeeder = app.get(LocationsSeeder)
  await locationSeeder.seed()

  const ordersSeeder = app.get(OrdersSeeder)
  await ordersSeeder.seed()

  const documentation = () => SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs', app, documentation)

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
