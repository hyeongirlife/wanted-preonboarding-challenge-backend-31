import {
  IsOptional,
  IsInt,
  Min,
  IsString,
  IsBoolean,
  IsArray,
  Matches,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  perPage?: number = 10;

  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z_]+:(asc|desc)(,[a-zA-Z_]+:(asc|desc))*$/, {
    message: '정렬 형식이 올바르지 않습니다. 예: created_at:desc,price:asc',
  })
  sort?: string = 'created_at:desc';

  @IsOptional()
  @IsString()
  status?: 'ACTIVE' | 'OUT_OF_STOCK' | 'DELETED';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((id) => parseInt(id, 10));
    }
    return value;
  })
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  category?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  seller?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  brand?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  inStock?: boolean;

  @IsOptional()
  @IsString()
  search?: string;
}
