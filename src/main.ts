import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import swaggerConfig from './config/documentation';
import { loggerMiddleware } from './common/helpers/logger';
import { ValidationPipe } from '@nestjs/common';
import { UserSeeds } from './seeders/users/user.seeds';
import { DateFormatInterceptor } from './interceptors/date-format.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const documentation = () => SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs', app, documentation)

  app.use(loggerMiddleware)

  app.enableCors()
  
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
