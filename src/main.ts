import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/documentation';
import { loggerMiddleware } from './common/helpers/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const documentation = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs', app, documentation)

  app.use(loggerMiddleware)

  app.enableCors()
  
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
