import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from './entities/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { CustomLoggerService } from '../common/logger.service';

@Controller('user')
export class UserController {
  private readonly logger = new CustomLoggerService();

  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      this.logger.log(`Creating new user: ${createUserDto.email}`);
      return await this.userService.createUser(createUserDto);
    } catch (error) {
      this.logger.error(`Error creating user ${createUserDto.email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  async findAll(@GetUser() user: any) {
    try {
      this.logger.log(`Admin ${user.email} fetching all users`);
      return await this.userService.findAll();
    } catch (error) {
      this.logger.error(`Error fetching all users by ${user.email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string, @GetUser() user: any) {
    try {
      this.logger.log(`Admin ${user.email} fetching user with ID: ${id}`);
      return await this.userService.findOne(+id);
    } catch (error) {
      this.logger.error(`Error fetching user with ID ${id} by ${user.email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @GetUser() user: any) {
    try {
      this.logger.log(`User ${user.email} updating user with ID: ${id}`);
      return await this.userService.update(+id, updateUserDto);
    } catch (error) {
      this.logger.error(`Error updating user with ID ${id} by ${user.email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string, @GetUser() user: any) {
    try {
      this.logger.log(`Admin ${user.email} deleting user with ID: ${id}`);
      return await this.userService.remove(+id);
    } catch (error) {
      this.logger.error(`Error deleting user with ID ${id} by ${user.email}: ${error.message}`, error.stack);
      throw error;
    }
  }
}