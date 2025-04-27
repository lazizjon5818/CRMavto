import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Branch, BranchCreationAttributes } from './entities/branch.entity';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { CustomLoggerService } from '../common/logger.service';
import { UserRole } from '../user/entities/user.entity';

@Injectable()
export class BranchService {
  private readonly logger = new CustomLoggerService();

  constructor(
    @InjectModel(Branch)
    private readonly branchModel: typeof Branch,
  ) {}

  async create(createBranchDto: CreateBranchDto, user: any) {
    try {
      this.logger.log(`Creating branch: ${createBranchDto.name}`);
      const existingBranch = await this.branchModel.findOne({
        where: { name: createBranchDto.name },
      });
      if (existingBranch) {
        this.logger.warn(`Branch with name ${createBranchDto.name} already exists`);
        throw new ConflictException('Bu nomdagi filial allaqachon mavjud');
      }
      const branchData: BranchCreationAttributes = {
        ...createBranchDto,
        isActive: true,
      };
      const branch = await this.branchModel.create(branchData);
      this.logger.log(`Branch created successfully: ${branch.name}`);
      return branch;
    } catch (error) {
      this.logger.error(`Error creating branch ${createBranchDto.name}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(user: any) {
    try {
      this.logger.debug(`Fetching all branches for user: ${user.email}`);
      if (user.role === UserRole.SUPER_ADMIN) {
        const branches = await this.branchModel.findAll();
        this.logger.log(`Total branches fetched: ${branches.length}`);
        return branches;
      }
      if (user.role === UserRole.ADMIN) {
        if (!user.branchId) {
          this.logger.warn(`Admin ${user.email} has no branch assigned`);
          throw new ForbiddenException('Sizga filial biriktirilmagan');
        }
        const branches = await this.branchModel.findAll({
          where: { id: user.branchId },
        });
        this.logger.log(`Branches fetched for admin ${user.email}: ${branches.length}`);
        return branches;
      }
      throw new ForbiddenException('Siz filiallarni ko‘ra olmaysiz');
    } catch (error) {
      this.logger.error(`Error fetching branches: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number, user: any) {
    try {
      this.logger.debug(`Fetching branch with ID: ${id}`);
      const branch = await this.branchModel.findByPk(id);
      if (!branch) {
        this.logger.warn(`Branch with ID ${id} not found`);
        throw new NotFoundException('Filial topilmadi');
      }
      if (user.role === UserRole.SUPER_ADMIN) {
        return branch;
      }
      if (user.role === UserRole.ADMIN) {
        if (!user.branchId) {
          this.logger.warn(`Admin ${user.email} has no branch assigned`);
          throw new ForbiddenException('Sizga filial biriktirilmagan');
        }
        if (branch.id !== user.branchId) {
          this.logger.warn(`Admin ${user.email} attempted to access branch from another branch`);
          throw new ForbiddenException('Siz faqat o‘z filialingizni ko‘ra olasiz');
        }
        return branch;
      }
      throw new ForbiddenException('Siz filialni ko‘ra olmaysiz');
    } catch (error) {
      this.logger.error(`Error fetching branch with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, updateBranchDto: UpdateBranchDto, user: any) {
    try {
      this.logger.log(`Updating branch with ID: ${id}`);
      const branch = await this.branchModel.findByPk(id);
      if (!branch) {
        this.logger.warn(`Branch with ID ${id} not found`);
        throw new NotFoundException('Filial topilmadi');
      }
      if (user.role === UserRole.SUPER_ADMIN) {
        await branch.update(updateBranchDto);
        this.logger.log(`Branch updated successfully: ${branch.name}`);
        return branch;
      }
      if (user.role === UserRole.ADMIN) {
        if (!user.branchId) {
          this.logger.warn(`Admin ${user.email} has no branch assigned`);
          throw new ForbiddenException('Sizga filial biriktirilmagan');
        }
        if (branch.id !== user.branchId) {
          this.logger.warn(`Admin ${user.email} attempted to update branch from another branch`);
          throw new ForbiddenException('Siz faqat o‘z filialingizni yangilay olasiz');
        }
        await branch.update(updateBranchDto);
        this.logger.log(`Branch updated successfully: ${branch.name}`);
        return branch;
      }
      throw new ForbiddenException('Siz filialni yangilay olmaysiz');
    } catch (error) {
      this.logger.error(`Error updating branch with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number, user: any) {
    try {
      this.logger.log(`Deleting branch with ID: ${id}`);
      const branch = await this.branchModel.findByPk(id);
      if (!branch) {
        this.logger.warn(`Branch with ID ${id} not found`);
        throw new NotFoundException('Filial topilmadi');
      }
      if (user.role === UserRole.SUPER_ADMIN) {
        await branch.destroy();
        this.logger.log(`Branch deleted successfully: ${branch.name}`);
        return { message: 'Filial o‘chirildi' };
      }
      if (user.role === UserRole.ADMIN) {
        if (!user.branchId) {
          this.logger.warn(`Admin ${user.email} has no branch assigned`);
          throw new ForbiddenException('Sizga filial biriktirilmagan');
        }
        if (branch.id !== user.branchId) {
          this.logger.warn(`Admin ${user.email} attempted to delete branch from another branch`);
          throw new ForbiddenException('Siz faqat o‘z filialingizni o‘chira olasiz');
        }
        await branch.destroy();
        this.logger.log(`Branch deleted successfully: ${branch.name}`);
        return { message: 'Filial o‘chirildi' };
      }
      throw new ForbiddenException('Siz filialni o‘chira olmaysiz');
    } catch (error) {
      this.logger.error(`Error deleting branch with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}