import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Sale } from './entities/sale.entity';
import { CustomLoggerService } from '../common/logger.service';

@Module({
  imports: [SequelizeModule.forFeature([Sale])],
  controllers: [SalesController],
  providers: [SalesService, CustomLoggerService],
})
export class SalesModule {}