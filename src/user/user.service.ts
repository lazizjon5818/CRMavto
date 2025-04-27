import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CustomLoggerService } from '../common/logger.service';
import { Branch } from '../branch/entities/branch.entity';

@Injectable()
export class UserService {
  private readonly logger = new CustomLoggerService();

  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { username, email, password, role, branchId } = createUserDto;

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
        branchId,
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
      const user = await this.userModel.findOne({
        where: { email },
        include: [Branch],
      });
      if (!user) {
        this.logger.warn(`User with email ${email} not found`);
      }
      return user;
    } catch (error) {
      this.logger.error(`Error finding user by email ${email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(currentUser: any) {
    try {
      this.logger.debug(`Fetching all users for user: ${currentUser.email}`);
      if (currentUser.role === UserRole.SUPER_ADMIN) {
        return await this.userModel.findAll({
          include: [Branch],
        });
      }
      if (currentUser.role === UserRole.ADMIN) {
        if (!currentUser.branchId) {
          this.logger.warn(`Admin ${currentUser.email} has no branch assigned`);
          throw new ForbiddenException('Sizga filial biriktirilmagan');
        }
        return await this.userModel.findAll({
          where: { branchId: currentUser.branchId },
          include: [Branch],
        });
      }
      throw new ForbiddenException('Faqat super_admin yoki admin foydalanuvchilarni ko‘ra oladi');
    } catch (error) {
      this.logger.error(`Error fetching all users: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number, currentUser: any) {
    try {
      this.logger.debug(`Fetching user with ID: ${id}`);
      const user = await this.userModel.findByPk(id, {
        include: [Branch],
      });
      if (!user) {
        this.logger.warn(`User with ID ${id} not found`);
        throw new NotFoundException('Foydalanuvchi topilmadi');
      }
      if (currentUser.role === UserRole.SUPER_ADMIN) {
        return user;
      }
      if (currentUser.role === UserRole.ADMIN) {
        if (!currentUser.branchId) {
          this.logger.warn(`Admin ${currentUser.email} has no branch assigned`);
          throw new ForbiddenException('Sizga filial biriktirilmagan');
        }
        if (user.branchId !== currentUser.branchId) {
          this.logger.warn(`Admin ${currentUser.email} attempted to access user from another branch`);
          throw new ForbiddenException('Siz faqat o‘z filialingizdagi foydalanuvchilarni ko‘ra olasiz');
        }
        return user;
      }
      if (currentUser.sub === id) {
        return user;
      }
      throw new ForbiddenException('Siz faqat o‘zingizni ko‘ra olasiz');
    } catch (error) {
      this.logger.error(`Error fetching user with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto, currentUser: any) {
    try {
      this.logger.log(`Updating user with ID: ${id} by ${currentUser.email}`);
      const user = await this.userModel.findByPk(id);
      if (!user) {
        this.logger.warn(`User with ID ${id} not found`);
        throw new NotFoundException('Foydalanuvchi topilmadi');
      }
      if (currentUser.role === UserRole.SUPER_ADMIN) {
        if (updateUserDto.password) {
          updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        await user.update(updateUserDto);
        this.logger.log(`User with ID ${id} updated successfully by super_admin`);
        return user;
      }
      if (currentUser.role === UserRole.ADMIN) {
        if (!currentUser.branchId) {
          this.logger.warn(`Admin ${currentUser.email} has no branch assigned`);
          throw new ForbiddenException('Sizga filial biriktirilmagan');
        }
        if (user.branchId !== currentUser.branchId) {
          this.logger.warn(`Admin ${currentUser.email} attempted to update user from another branch`);
          throw new ForbiddenException('Siz faqat o‘z filialingizdagi foydalanuvchilarni yangilay olasiz');
        }
        if (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) {
          if (user.id !== currentUser.sub) {
            this.logger.warn(`Admin ${currentUser.email} attempted to update another admin or super_admin`);
            throw new ForbiddenException('Siz boshqa admin yoki super_admin foydalanuvchilarni yangilay olmaysiz');
          }
        }
        if (updateUserDto.password) {
          updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        await user.update(updateUserDto);
        this.logger.log(`User with ID ${id} updated successfully by admin`);
        return user;
      }
      if (currentUser.sub === id) {
        if (updateUserDto.password) {
          updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        await user.update(updateUserDto);
        this.logger.log(`User with ID ${id} updated their own profile`);
        return user;
      }
      throw new ForbiddenException('Siz faqat o‘zingizni yangilay olasiz');
    } catch (error) {
      this.logger.error(`Error updating user with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number, currentUser: any) {
    try {
      this.logger.log(`Deleting user with ID: ${id} by ${currentUser.email}`);
      const user = await this.userModel.findByPk(id);
      if (!user) {
        this.logger.warn(`User with ID ${id} not found`);
        throw new NotFoundException('Foydalanuvchi topilmadi');
      }
      if (currentUser.role === UserRole.SUPER_ADMIN) {
        await user.destroy();
        this.logger.log(`User with ID ${id} deleted successfully by super_admin`);
        return { message: 'Foydalanuvchi o‘chirildi' };
      }
      if (currentUser.role === UserRole.ADMIN) {
        if (!currentUser.branchId) {
          this.logger.warn(`Admin ${currentUser.email} has no branch assigned`);
          throw new ForbiddenException('Sizga filial biriktirilmagan');
        }
        if (user.branchId !== currentUser.branchId) {
          this.logger.warn(`Admin ${currentUser.email} attempted to delete user from another branch`);
          throw new ForbiddenException('Siz faqat o‘z filialingizdagi foydalanuvchilarni o‘chira olasiz');
        }
        if (user.id === currentUser.sub) {
          this.logger.warn(`Admin ${currentUser.email} attempted to delete themselves`);
          throw new ForbiddenException('Siz o‘zingizni o‘chira olmaysiz');
        }
        if (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) {
          this.logger.warn(`Admin ${currentUser.email} attempted to delete another admin or super_admin`);
          throw new ForbiddenException('Siz boshqa admin yoki super_admin foydalanuvchilarni o‘chira olmaysiz');
        }
        await user.destroy();
        this.logger.log(`User with ID ${id} deleted successfully by admin`);
        return { message: 'Foydalanuvchi o‘chirildi' };
      }
      throw new ForbiddenException('Siz foydalanuvchilarni o‘chira olmaysiz');
    } catch (error) {
      this.logger.error(`Error deleting user with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async countAllUsers(currentUser: any): Promise<number> {
    try {
      this.logger.debug(`Counting all users for user: ${currentUser.email}`);
      if (currentUser.role === UserRole.SUPER_ADMIN) {
        const count = await this.userModel.count();
        this.logger.log(`Total users counted: ${count}`);
        return count;
      }
      if (currentUser.role === UserRole.ADMIN) {
        if (!currentUser.branchId) {
          this.logger.warn(`Admin ${currentUser.email} has no branch assigned`);
          throw new ForbiddenException('Sizga filial biriktirilmagan');
        }
        const count = await this.userModel.count({
          where: { branchId: currentUser.branchId },
        });
        this.logger.log(`Total users counted for branch ${currentUser.branchId}: ${count}`);
        return count;
      }
      throw new ForbiddenException('Siz foydalanuvchilar sonini ko‘ra olmaysiz');
    } catch (error) {
      this.logger.error(`Error counting users: ${error.message}`, error.stack);
      throw error;
    }
  }

  async countAdmins(currentUser: any): Promise<number> {
    try {
      this.logger.debug(`Counting admin users for user: ${currentUser.email}`);
      if (currentUser.role === UserRole.SUPER_ADMIN) {
        const count = await this.userModel.count({
          where: { role: UserRole.ADMIN },
        });
        this.logger.log(`Total admins counted: ${count}`);
        return count;
      }
      if (currentUser.role === UserRole.ADMIN) {
        if (!currentUser.branchId) {
          this.logger.warn(`Admin ${currentUser.email} has no branch assigned`);
          throw new ForbiddenException('Sizga filial biriktirilmagan');
        }
        const count = await this.userModel.count({
          where: { role: UserRole.ADMIN, branchId: currentUser.branchId },
        });
        this.logger.log(`Total admins counted for branch ${currentUser.branchId}: ${count}`);
        return count;
      }
      throw new ForbiddenException('Siz adminlar sonini ko‘ra olmaysiz');
    } catch (error) {
      this.logger.error(`Error counting admins: ${error.message}`, error.stack);
      throw error;
    }
  }
}