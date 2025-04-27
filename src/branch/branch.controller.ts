import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { CustomLoggerService } from '../common/logger.service';

@Controller('branch')
export class BranchController {
  private readonly logger = new CustomLoggerService();

  constructor(private readonly branchService: BranchService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post()
  async create(@Body() createBranchDto: CreateBranchDto, @GetUser() user: any) {
    try {
      this.logger.log(`User ${user.email} creating branch: ${createBranchDto.name}`);
      return await this.branchService.create(createBranchDto, user);
    } catch (error) {
      this.logger.error(`Error creating branch by ${user.email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Get()
  async findAll(@GetUser() user: any) {
    try {
      this.logger.log(`User ${user.email} fetching all branches`);
      return await this.branchService.findAll(user);
    } catch (error) {
      this.logger.error(`Error fetching branches by ${user.email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: any) {
    try {
      this.logger.log(`User ${user.email} fetching branch with ID: ${id}`);
      return await this.branchService.findOne(id, user);
    } catch (error) {
      this.logger.error(`Error fetching branch with ID ${id} by ${user.email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBranchDto: UpdateBranchDto,
    @GetUser() user: any,
  ) {
    try {
      this.logger.log(`User ${user.email} updating branch with ID: ${id}`);
      return await this.branchService.update(id, updateBranchDto, user);
    } catch (error) {
      this.logger.error(`Error updating branch with ID ${id} by ${user.email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: any) {
    try {
      this.logger.log(`User ${user.email} deleting branch with ID: ${id}`);
      return await this.branchService.remove(id, user);
    } catch (error) {
      this.logger.error(`Error deleting branch with ID ${id} by ${user.email}: ${error.message}`, error.stack);
      throw error;
    }
  }
}