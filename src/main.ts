import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // transform data before send to response
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // SIMPLE SWAGGER
  const config = new DocumentBuilder()
    .setTitle('backend_test_task example')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('backend_test_task')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
