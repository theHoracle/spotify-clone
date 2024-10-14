import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { SeedService } from './seed/seed.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  // SEED DB SERVICE
  // const seedService = app.get(SeedService);
  // await seedService.seed();

  // SWAGGER API HELPER
  const config = new DocumentBuilder()
    .setTitle('Spotify Clone')
    .setDescription('Spotify Clone API description')
    .setVersion('1.0')
    .addTag('nest-fundamentals')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Add JWT Token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get<number>('port'));
  console.log(
    `Application is running on: ${await app.getUrl()} in ${configService.get<string>('NODE_ENV')}`,
  );

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
