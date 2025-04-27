import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, ParseIntPipe } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CustomLoggerService } from '../common/logger.service';

@Controller('sales')
@UseGuards(JwtAuthGuard)
export class SalesController {
  private readonly logger = new CustomLoggerService();

  constructor(private readonly salesService: SalesService) {}

  @Post()
  async create(@Body() createSaleDto: CreateSaleDto, @Request() req: any) {
    const action = 'create sale';
    this.logger.log(`User ${req.user.email} attempting to ${action}`);

    try {
      const sale = await this.salesService.create(createSaleDto, req.user);
      this.logger.log(`Sale ${action}d successfully: ID ${sale.id} by ${req.user.email}`);
      return sale;
    } catch (error) {
      this.logger.error(`Error ${action}ing by ${req.user.email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get()
  async findAll(@Request() req: any) {
    const action = 'view all sales';
    this.logger.log(`User ${req.user.email} attempting to ${action}`);

    try {
      const sales = await this.salesService.findAll(req.user);
      this.logger.log(`Sales ${action}ed successfully by ${req.user.email}`);
      return sales;
    } catch (error) {
      this.logger.error(`Error ${action}ing by ${req.user.email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    const action = 'view sale';
    this.logger.log(`User ${req.user.email} attempting to ${action} ID ${id}`);

    try {
      const sale = await this.salesService.findOne(id, req.user);
      this.logger.log(`Sale ID ${id} ${action}ed successfully by ${req.user.email}`);
      return sale;
    } catch (error) {
      this.logger.error(`Error ${action}ing ID ${id} by ${req.user.email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSaleDto: UpdateSaleDto,
    @Request() req: any,
  ) {
    const action = 'update sale';
    this.logger.log(`User ${req.user.email} attempting to ${action} ID ${id}`);

    try {
      const sale = await this.salesService.update(id, updateSaleDto, req.user);
      this.logger.log(`Sale ID ${id} ${action}d successfully by ${req.user.email}`);
      return sale;
    } catch (error) {
      this.logger.error(`Error ${action}ing ID ${id} by ${req.user.email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    const action = 'delete sale';
    this.logger.log(`User ${req.user.email} attempting to ${action} ID ${id}`);

    try {
      const result = await this.salesService.remove(id, req.user);
      this.logger.log(`Sale ID ${id} ${action}d successfully by ${req.user.email}`);
      return result;
    } catch (error) {
      this.logger.error(`Error ${action}ing ID ${id} by ${req.user.email}: ${error.message}`, error.stack);
      throw error;
    }
  }
}