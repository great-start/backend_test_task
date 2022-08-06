import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppConfigService } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // transform data before send to response
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // swagger
  const config = new DocumentBuilder()
    .setTitle('backend test task')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const appConfig: AppConfigService = app.get('AppConfigService');

  await app.listen(appConfig.port);
}
bootstrap();
