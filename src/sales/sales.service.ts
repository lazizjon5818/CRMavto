import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sale } from './entities/sale.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { CustomLoggerService } from '../common/logger.service';
import { UserRole } from '../user/entities/user.entity';
import { User } from '../user/entities/user.entity';
import { Branch } from '../branch/entities/branch.entity';

@Injectable()
export class SalesService {
  private readonly logger = new CustomLoggerService();

  constructor(
    @InjectModel(Sale)
    private readonly saleModel: typeof Sale,
  ) {}

  private checkAccess(sale: Sale, user: any, action: string): void {
    if (user.role === UserRole.SUPER_ADMIN) return;

    if (user.role === UserRole.ADMIN) {
      if (!user.branchId) {
        this.logger.warn(`Admin ${user.email} has no branch assigned for ${action}`);
        throw new ForbiddenException('Sizga filial biriktirilmagan');
      }
      if (sale.branchId !== user.branchId) {
        this.logger.warn(`Admin ${user.email} attempted to ${action} sale from another branch`);
        throw new ForbiddenException(`Siz faqat o‘z filialingizdagi savdolarni ${action} qilishingiz mumkin`);
      }
      return;
    }

    if (user.role === UserRole.USER) {
      if (sale.userId !== user.sub) {
        this.logger.warn(`User ${user.email} attempted to ${action} another user's sale`);
        throw new ForbiddenException(`Siz faqat o‘zingizning savdolaringizni ${action} qilishingiz mumkin`);
      }
      return;
    }

    this.logger.warn(`User ${user.email} has no permission to ${action} sales`);
    throw new ForbiddenException(`Sizda savdolarni ${action} qilish huquqi yo‘q`);
  }

  async create(createSaleDto: CreateSaleDto, user: any): Promise<Sale> {
    const action = 'create';
    this.logger.log(`User ${user.email} attempting to ${action} sale`);

    try {
      // Rollar cheklovi
      if (user.role === UserRole.SUPER_ADMIN) {
        // SUPER_ADMIN uchun hech qanday cheklov yo‘q
      } else if (user.role === UserRole.ADMIN) {
        if (!user.branchId) {
          this.logger.warn(`Admin ${user.email} has no branch assigned for ${action}`);
          throw new ForbiddenException('Sizga filial biriktirilmagan');
        }
        if (createSaleDto.branchId !== user.branchId) {
          this.logger.warn(`Admin ${user.email} attempted to ${action} sale in another branch`);
          throw new ForbiddenException('Siz faqat o‘z filialingizda savdo qo‘shishingiz mumkin');
        }
      } else if (user.role === UserRole.USER) {
        if (!user.branchId) {
          this.logger.warn(`User ${user.email} has no branch assigned for ${action}`);
          throw new ForbiddenException('Sizga filial biriktirilmagan');
        }
        if (createSaleDto.branchId !== user.branchId) {
          this.logger.warn(`User ${user.email} attempted to ${action} sale in another branch`);
          throw new ForbiddenException('Siz faqat o‘z filialingizda savdo qo‘shishingiz mumkin');
        }
        if (createSaleDto.userId !== user.sub) {
          this.logger.warn(`User ${user.email} attempted to ${action} sale for another user`);
          throw new ForbiddenException('Siz faqat o‘zingiz uchun savdo qo‘shishingiz mumkin');
        }
      } else {
        this.logger.warn(`User ${user.email} has no permission to ${action} sales`);
        throw new ForbiddenException('Sizda savdo qo‘shish huquqi yo‘q');
      }

      // Sale obyektini yaratish
      const sale = await this.saleModel.create({
        userId: createSaleDto.userId,
        branchId: createSaleDto.branchId,
        productName: createSaleDto.productName,
        quantity: createSaleDto.quantity,
        price: createSaleDto.price,
        saleDate: createSaleDto.saleDate || new Date(),
        isActive: true,
      } as any);

      this.logger.log(`Sale ${action}d successfully: ID ${sale.id} by ${user.email}`);
      return sale;
    } catch (error) {
      this.logger.error(`Error ${action}ing sale by ${user.email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(user: any): Promise<Sale[]> {
    const action = 'view all';
    this.logger.log(`User ${user.email} attempting to ${action} sales`);

    try {
      if (user.role === UserRole.SUPER_ADMIN) {
        return await this.saleModel.findAll({
          include: [User, Branch],
        });
      }

      if (user.role === UserRole.ADMIN) {
        if (!user.branchId) {
          this.logger.warn(`Admin ${user.email} has no branch assigned for ${action}`);
          throw new ForbiddenException('Sizga filial biriktirilmagan');
        }
        return await this.saleModel.findAll({
          where: { branchId: user.branchId },
          include: [User, Branch],
        });
      }

      if (user.role === UserRole.USER) {
        return await this.saleModel.findAll({
          where: { userId: user.sub },
          include: [User, Branch],
        });
      }

      this.logger.warn(`User ${user.email} has no permission to ${action} sales`);
      throw new ForbiddenException('Sizda savdolarni ko‘rish huquqi yo‘q');
    } catch (error) {
      this.logger.error(`Error ${action}ing sales by ${user.email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number, user: any): Promise<Sale> {
    const action = 'view';
    this.logger.log(`User ${user.email} attempting to ${action} sale ID ${id}`);

    try {
      const sale = await this.saleModel.findByPk(id, {
        include: [User, Branch],
      });

      if (!sale) {
        this.logger.warn(`Sale ID ${id} not found for ${action} by ${user.email}`);
        throw new NotFoundException('Savdo topilmadi');
      }

      this.checkAccess(sale, user, action);
      this.logger.log(`Sale ID ${id} ${action}ed successfully by ${user.email}`);
      return sale;
    } catch (error) {
      this.logger.error(`Error ${action}ing sale ID ${id} by ${user.email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, updateSaleDto: UpdateSaleDto, user: any): Promise<Sale> {
    const action = 'update';
    this.logger.log(`User ${user.email} attempting to ${action} sale ID ${id}`);

    try {
      const sale = await this.saleModel.findByPk(id);
      if (!sale) {
        this.logger.warn(`Sale ID ${id} not found for ${action} by ${user.email}`);
        throw new NotFoundException('Savdo topilmadi');
      }

      this.checkAccess(sale, user, action);
      await sale.update(updateSaleDto);

      this.logger.log(`Sale ID ${id} ${action}d successfully by ${user.email}`);
      return sale;
    } catch (error) {
      this.logger.error(`Error ${action}ing sale ID ${id} by ${user.email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number, user: any): Promise<{ message: string }> {
    const action = 'delete';
    this.logger.log(`User ${user.email} attempting to ${action} sale ID ${id}`);

    try {
      const sale = await this.saleModel.findByPk(id);
      if (!sale) {
        this.logger.warn(`Sale ID ${id} not found for ${action} by ${user.email}`);
        throw new NotFoundException('Savdo topilmadi');
      }

      if (user.role === UserRole.USER) {
        this.logger.warn(`User ${user.email} attempted to ${action} sale ID ${id}`);
        throw new ForbiddenException('Foydalanuvchilarga savdolarni o‘chirish taqiqlangan');
      }

      this.checkAccess(sale, user, action);
      await sale.destroy();

      this.logger.log(`Sale ID ${id} ${action}d successfully by ${user.email}`);
      return { message: 'Savdo o‘chirildi' };
    } catch (error) {
      this.logger.error(`Error ${action}ing sale ID ${id} by ${user.email}: ${error.message}`, error.stack);
      throw error;
    }
  }
}