import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import { CustomLoggerService } from './common/logger.service';

async function bootstrap() {
  const logger = new CustomLoggerService();
  try {
    const app = await NestFactory.create(AppModule, { logger });

    // Global xato filtri
    app.useGlobalFilters(new AllExceptionsFilter()); 

    // Global DTO validatsiya
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Faqat DTO'da belgilangan maydonlarni qabul qiladi
        forbidNonWhitelisted: true, // Noma'lum maydonlar bo'lsa xato qaytaradi
        transform: true, // Avtomatik ma'lumot turini o'zgartirish
      }),
    ); 

    // Xavfsizlik middleware'lari
    app.use(helmet.default()); // Umumiy xavfsizlik sarlavhalari
    app.use(cookieParser()); // Cookie'larni boshqarish

    // CORS sozlamalari (cookie'lar uchun)
    app.enableCors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3001', // Frontend domeni
      credentials: true, // Cookie'lar uchun ruxsat
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Port sozlamasi
    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`Server is running on port ${port}`);
  } catch (error) {
    logger.error('Failed to start the application', error.stack);
    process.exit(1);
  }
}
bootstrap();