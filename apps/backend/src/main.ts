import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app-config.service';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(AppConfigService);

  // Global prefix
  app.setGlobalPrefix('api');

  // Cookie parser middleware
  app.use(cookieParser(appConfig.sessionCookieSecret));

  // Global Validation Pipe with strict whitelisting & transformation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Dynamic CORS setup from environment variable (FRONTEND_ORIGIN)
  app.enableCors({
    origin: appConfig.frontendOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'X-CSRF-Token'],
  });

  const port = appConfig.port;
  await app.listen(port);
  logger.log(`PT Repo Manager Backend running on port ${port}`);
  logger.log(`CORS allowed for origin: ${appConfig.frontendOrigin}`);
}

bootstrap();
