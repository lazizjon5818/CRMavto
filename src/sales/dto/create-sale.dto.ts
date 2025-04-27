import { IsString, IsInt, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateSaleDto {
  @IsInt()
  userId: number;

  @IsInt()
  branchId: number;

  @IsString()
  productName: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  saleDate?: Date;
}