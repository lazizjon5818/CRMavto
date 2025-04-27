import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CustomLoggerService } from '../common/logger.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new CustomLoggerService();

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const token = request?.cookies['access_token'];
          if (!token) {
            this.logger.warn('No JWT token found in cookies');
          }
          return token;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(), // Fallback sifatida Bearer token
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your_very_secure_secret_key',
    });
  }

  async validate(payload: any) {
    this.logger.debug(`Validating JWT payload: ${JSON.stringify(payload)}`);
    if (!payload.sub || !payload.email) {
      this.logger.warn('Invalid JWT payload');
      throw new UnauthorizedException('Noto‘g‘ri JWT token');
    }
    return { sub: payload.sub, email: payload.email, role: payload.role, branchId: payload.branchId };
  }
}