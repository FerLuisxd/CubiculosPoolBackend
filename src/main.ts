import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './utils/exceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true })
  );
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter());
  const port = Number(process.env.PORT)||5000
  await app.listen(port, '0.0.0.0', function (err, address) {
    if (err) {
      console.log(err)
      process.exit(1)
    }
    console.log(`server listening on ${address}`)
  })
  console.log('working',process.env.NODE_ENV)
}
bootstrap();
