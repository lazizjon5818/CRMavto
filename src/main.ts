import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.listen(process.env.PORT ?? 3000);
    console.log(`Server is running on port ${process.env.PORT ?? 3000}`);
  } catch (error) {
    console.error('Failed to start the application:', error);
    // Xatolikni qayta ishlash logikasi (masalan, jarayonni to'xtatish)
    process.exit(1);
  }
}
bootstrap();