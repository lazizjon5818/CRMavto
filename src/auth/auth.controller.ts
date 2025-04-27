import { Controller, Post, Body, ValidationPipe, Response, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CustomLoggerService } from '../common/logger.service';

class LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  private readonly logger = new CustomLoggerService();

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body(ValidationPipe) loginDto: LoginDto, @Response() res: any) {
    try {
      this.logger.log(`Login attempt for email: ${loginDto.email}`);
      const result = await this.authService.login(loginDto.email, loginDto.password);
      if (!result) {
        this.logger.warn(`Invalid credentials for email: ${loginDto.email}`);
        throw new UnauthorizedException('Email yoki parol noto‘g‘ri');
      }

      // Tokenni cookie ga joylashtirish
      res.cookie('access_token', result.access_token, {
        httpOnly: true, // JavaScript orqali cookie'ga kirishni cheklaydi
        secure: process.env.NODE_ENV === 'production', // Faqat HTTPS orqali (production uchun)
        sameSite: 'strict', // CSRF hujumlaridan himoya
        maxAge: 24 * 60 * 60 * 1000, // 24 soat amal qiladi
      });

      this.logger.log(`User logged in successfully: ${loginDto.email}`);
      return res.json({
        user: result.user,
        message: 'Muvaffaqiyatli kirish',
      });
    } catch (error) {
      this.logger.error(`Error during login for ${loginDto.email}: ${error.message}`, error.stack);
      throw error;
    }
  }
}