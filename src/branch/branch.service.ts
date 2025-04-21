import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Branch, BranchCreationAttributes } from './entities/branch.entity';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { CustomLoggerService } from '../common/logger.service';

@Injectable()
export class BranchService {
  private readonly logger = new CustomLoggerService();

  constructor(
    @InjectModel(Branch)
    private readonly branchModel: typeof Branch,
  ) {}

  async create(createBranchDto: CreateBranchDto) {
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

  async findAll() {
    try {
      this.logger.debug(`Fetching all branches`);
      const branches = await this.branchModel.findAll();
      this.logger.log(`Total branches fetched: ${branches.length}`);
      return branches;
    } catch (error) {
      this.logger.error(`Error fetching branches: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      this.logger.debug(`Fetching branch with ID: ${id}`);
      const branch = await this.branchModel.findByPk(id);
      if (!branch) {
        this.logger.warn(`Branch with ID ${id} not found`);
        throw new NotFoundException('Filial topilmadi');
      }
      return branch;
    } catch (error) {
      this.logger.error(`Error fetching branch with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, updateBranchDto: UpdateBranchDto) {
    try {
      this.logger.log(`Updating branch with ID: ${id}`);
      const branch = await this.branchModel.findByPk(id);
      if (!branch) {
        this.logger.warn(`Branch with ID ${id} not found`);
        throw new NotFoundException('Filial topilmadi');
      }
      await branch.update(updateBranchDto);
      this.logger.log(`Branch updated successfully: ${branch.name}`);
      return branch;
    } catch (error) {
      this.logger.error(`Error updating branch with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      this.logger.log(`Deleting branch with ID: ${id}`);
      const branch = await this.branchModel.findByPk(id);
      if (!branch) {
        this.logger.warn(`Branch with ID ${id} not found`);
        throw new NotFoundException('Filial topilmadi');
      }
      await branch.destroy();
      this.logger.log(`Branch deleted successfully: ${branch.name}`);
      return { message: 'Filial o‘chirildi' };
    } catch (error) {
      this.logger.error(`Error deleting branch with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}