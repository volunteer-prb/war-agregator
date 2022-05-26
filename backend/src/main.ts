import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { writeFileSync } from 'fs';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const config = new DocumentBuilder()
    .setTitle('War Aggregator')
    .setDescription('The API for War Aggregator UI')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  writeFileSync('open-api.json', JSON.stringify(document, null, 2));
  SwaggerModule.setup('api', app, document);
  await app.listen(8080);
}
bootstrap();
