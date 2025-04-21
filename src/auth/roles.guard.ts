import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../user/entities/user.entity'; // UserRole enumini import qilish

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true; // Agar rol talab qilinmasa, ruxsat beriladi
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // JwtStrategy dan kelgan user obyekti

    return requiredRoles.includes(user.role); // Foydalanuvchi roli talab qilingan rollarda bormi?
  }
}
