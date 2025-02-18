import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UserSeeds } from './seeders/users/user.seeds';
import { DateFormatInterceptor } from './interceptors/date-format.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new DateFormatInterceptor());

  const usersSeed = app.get(UserSeeds);
  await usersSeed.seed();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
