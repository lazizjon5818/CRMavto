import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ForbiddenException, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async createUser(@Body() createUserDto: CreateUserDto, @GetUser() user: any) {
    try {
      this.logger.log(`Super Admin ${user.email} creating new user: ${createUserDto.email}`);
      return await this.userService.createUser(createUserDto);
    } catch (error) {
      this.logger.error(`Error creating user ${createUserDto.email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async findAll(@GetUser() user: any) {
    try {
      this.logger.log(`Super Admin ${user.email} fetching all users`);
      return await this.userService.findAll();
    } catch (error) {
      this.logger.error(`Error fetching all users by ${user.email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER)
  async findMe(@GetUser() user: any) {
    try {
      this.logger.log(`User ${user.email} fetching own profile`);
      this.logger.debug(`User object: ${JSON.stringify(user)}`); // Debug log
      if (!user.sub) {
        throw new ForbiddenException('Foydalanuvchi ID topilmadi');
      }
      return await this.userService.findOne(user.sub);
    } catch (error) {
      this.logger.error(`Error fetching profile for ${user.email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: any) {
    try {
      this.logger.log(`Super Admin ${user.email} fetching user with ID: ${id}`);
      return await this.userService.findOne(id);
    } catch (error) {
      this.logger.error(`Error fetching user with ID ${id} by ${user.email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: any,
  ) {
    try {
      if (user.role !== UserRole.SUPER_ADMIN && user.sub !== id) {
        this.logger.warn(`User ${user.email} attempted to update another user ID: ${id}`);
        throw new ForbiddenException('Faqat o‘zingizni yangilay olasiz');
      }
      this.logger.log(`User ${user.email} updating user with ID: ${id}`);
      return await this.userService.update(id, updateUserDto);
    } catch (error) {
      this.logger.error(`Error updating user with ID ${id} by ${user.email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: any) {
    try {
      this.logger.log(`Super Admin ${user.email} deleting user with ID: ${id}`);
      return await this.userService.remove(id);
    } catch (error) {
      this.logger.error(`Error deleting user with ID ${id} by ${user.email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get('count/all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async countAllUsers(@GetUser() user: any) {
    try {
      this.logger.log(`Super Admin ${user.email} fetching total user count`);
      const count = await this.userService.countAllUsers();
      return { totalUsers: count };
    } catch (error) {
      this.logger.error(`Error fetching user count by ${user.email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get('count/admins')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async countAdmins(@GetUser() user: any) {
    try {
      this.logger.log(`Super Admin ${user.email} fetching admin count`);
      const count = await this.userService.countAdmins();
      return { totalAdmins: count };
    } catch (error) {
      this.logger.error(`Error fetching admin count by ${user.email}: ${error.message}`, error.stack);
      throw error;
    }
  }
}