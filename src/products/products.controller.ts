import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { PaginationQueryDto } from './dto/pagination-query.dto';
import { ProductsService } from './products.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.productsService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({
    summary: '특정 상품 조회',
    description: '상품 ID로 상품을 조회합니다.',
  })
  @ApiParam({ name: 'id', type: String, description: '상품 ID' })
  @ApiResponse({ status: 200, description: '상품 조회 성공' })
  @ApiResponse({ status: 404, description: '상품을 찾을 수 없음' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: '특정 상품 수정',
    description: '상품 ID로 상품을 수정합니다.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '특정 상품 삭제',
    description: '상품 ID로 상품을 삭제합니다.',
  })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
