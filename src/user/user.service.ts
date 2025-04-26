import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CustomLoggerService } from '../common/logger.service';

@Injectable()
export class UserService {
  private readonly logger = new CustomLoggerService();

  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { username, email, password, role } = createUserDto;

    try {
      this.logger.log(`Creating user with email: ${email}`);
      const existingUser = await this.userModel.findOne({
        where: { email },
      });
      if (existingUser) {
        this.logger.warn(`Failed to create user: Email ${email} already exists`);
        throw new ConflictException('Email allaqachon ro‘yxatdan o‘tgan');
      }

      const existingUsername = await this.userModel.findOne({
        where: { username },
      });
      if (existingUsername) {
        this.logger.warn(`Failed to create user: Username ${username} already exists`);
        throw new ConflictException('Username allaqachon ro‘yxatdan o‘tgan');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.userModel.create({
        username,
        email,
        password: hashedPassword,
        role: role || UserRole.USER,
      });

      this.logger.log(`User created successfully: ${email}`);
      const { password: _, ...result } = user.toJSON();
      return result;
    } catch (error) {
      this.logger.error(`Error creating user ${email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByEmail(email: string) {
    try {
      this.logger.debug(`Finding user by email: ${email}`);
      const user = await this.userModel.findOne({ where: { email } });
      if (!user) {
        this.logger.warn(`User with email ${email} not found`);
      }
      return user;
    } catch (error) {
      this.logger.error(`Error finding user by email ${email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll() {
    try {
      this.logger.debug(`Fetching all users`);
      return await this.userModel.findAll();
    } catch (error) {
      this.logger.error(`Error fetching all users: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      this.logger.debug(`Fetching user with ID: ${id}`);
      const user = await this.userModel.findByPk(id);
      if (!user) {
        this.logger.warn(`User with ID ${id} not found`);
        throw new NotFoundException('Foydalanuvchi topilmadi');
      }
      return user;
    } catch (error) {
      this.logger.error(`Error fetching user with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      this.logger.log(`Updating user with ID: ${id}`);
      const user = await this.userModel.findByPk(id);
      if (!user) {
        this.logger.warn(`User with ID ${id} not found`);
        throw new NotFoundException('Foydalanuvchi topilmadi');
      }
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }
      return await user.update(updateUserDto);
    } catch (error) {
      this.logger.error(`Error updating user with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      this.logger.log(`Admin deleting user with ID: ${id}`);
      const user = await this.userModel.findByPk(id);
      if (!user) {
        this.logger.warn(`User with ID ${id} not found`);
        throw new NotFoundException('Foydalanuvchi topilmadi');
      }
      await user.destroy();
      this.logger.log(`User with ID ${id} deleted successfully`);
      return { message: 'Foydalanuvchi o‘chirildi' };
    } catch (error) {
      this.logger.error(`Error deleting user with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async countAllUsers(): Promise<number> {
    try {
      this.logger.debug(`Counting all users`);
      const count = await this.userModel.count();
      this.logger.log(`Total users counted: ${count}`);
      return count;
    } catch (error) {
      this.logger.error(`Error counting users: ${error.message}`, error.stack);
      throw error;
    }
  }

  async countAdmins(): Promise<number> {
    try {
      this.logger.debug(`Counting admin users`);
      const count = await this.userModel.count({
        where: { role: UserRole.ADMIN },
      });
      this.logger.log(`Total admins counted: ${count}`);
      return count;
    } catch (error) {
      this.logger.error(`Error counting admins: ${error.message}`, error.stack);
      throw error;
    }
  }
}