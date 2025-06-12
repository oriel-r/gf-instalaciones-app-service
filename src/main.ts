import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import swaggerConfig from './config/documentation';
import { loggerMiddleware } from './common/helpers/logger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { UserSeeds } from './seeders/users/user.seeds';
import { LocationsSeeder } from './seeders/locations/locations.seeds';
import { OrdersSeeder } from './seeders/orders/orders.seeds';
import { appDataSource } from './config/data-source';

async function bootstrap() {

  await appDataSource.initialize()
  await appDataSource.runMigrations()

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });
  
  
  app.use(loggerMiddleware)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  
  app.enableCors({
    origin: '*'
  })
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false
    }),
  );
  
  app.useGlobalFilters(new HttpExceptionFilter());

  const usersSeed = app.get(UserSeeds);
  await usersSeed.seed(); 
  
  const locationSeeder = app.get(LocationsSeeder)
  await locationSeeder.seed()

  const ordersSeeder = app.get(OrdersSeeder)
  await ordersSeeder.seed()   


  const documentation = () => SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs', app, documentation)

  await app.listen(process.env.PORT ?? 8080, '0.0.0.0');
}
bootstrap();
