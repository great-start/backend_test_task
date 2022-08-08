import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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

  const PORT = app.get(ConfigService).get('PORT');
  const HOST = app.get(ConfigService).get('HOST');
  const PROTOCOL = app.get(ConfigService).get('PROTOCOL');
  const swaggerUrl = app.get(ConfigService).get('SWAGGER_URL');

  await app.listen(PORT, () => {
    console.log(`Server has been started on ${PROTOCOL}://${HOST}:${PORT}`);
    console.log(`Open swagger ${PROTOCOL}://${HOST}:${PORT}/${swaggerUrl}`);
  });
}
bootstrap();
