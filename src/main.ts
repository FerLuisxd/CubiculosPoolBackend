import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './utils/exceptionFilter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
const helmet = require('fastify-helmet')

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true })
  );
  const name = 'AppToShare'
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle( name)
    .setDescription(`The ${name} API description`)
    .setVersion('1.0')
    .build();

    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('api');

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api/swagger', app, document,{
      customCssUrl: 'https://raw.githubusercontent.com/ostranme/swagger-ui-themes/develop/themes/3.x/theme-monokai.css' 
    });

  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter());
  app.register(
    helmet,
    // Example of passing an option to x-powered-by middleware
    { hidePoweredBy: { setTo: 'PHP 4.2.0' } }
  )
  const port = Number(process.env.PORT) || 3000
  await app.listen(port, '0.0.0.0', function (err, address) {
    if (err) {
      console.log(err)
      process.exit(1)
    }
    console.log(`server listening on ${address}`, process.env.NODE_ENV)
  })
}
bootstrap();
