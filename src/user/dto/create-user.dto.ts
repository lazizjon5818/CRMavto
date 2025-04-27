import { IsString, IsEmail, MinLength, IsInt } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  role?: UserRole;

  @IsInt()
  branchId: number; // Majburiy maydon sifatida
}