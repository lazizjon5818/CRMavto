import { IsString, IsInt, IsNumber, Min, IsOptional, IsBoolean } from 'class-validator';

export class UpdateSaleDto {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsInt()
  branchId?: number;

  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  saleDate?: Date;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}