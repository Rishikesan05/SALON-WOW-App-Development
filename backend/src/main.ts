import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // All routes start with /api/ (e.g., /api/appointments, /api/auth/login)
  app.setGlobalPrefix('api');

  // Allow Flutter mobile app to call this server (Cross-Origin)
  app.enableCors();

  // Auto-validate request bodies using class-validator decorators
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown fields from request body
      forbidNonWhitelisted: true, // Throw error if unknown fields sent
      transform: true, // Auto-convert string "5" to number 5
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Salon WOW API running on port ${port}`);
}
bootstrap();
