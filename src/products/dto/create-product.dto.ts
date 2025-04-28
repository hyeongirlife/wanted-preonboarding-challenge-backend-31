import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsString()
  @IsOptional()
  fullDescription?: string;

  @IsNumber()
  sellerId: number;

  @IsNumber()
  brandId: number;

  @IsString()
  status: string;

  @IsArray()
  @IsOptional()
  categories?: number[];

  @IsArray()
  @IsOptional()
  tags?: number[];
}
