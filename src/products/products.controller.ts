import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  //   Post,
  //   Body,
  //   Patch,
  //   Param,
  //   Delete,
  Query,
} from '@nestjs/common';
// import { ProductsService } from './products.service';
// import { CreateProductDto } from './dto/create-product.dto';
// import { UpdateProductDto } from './dto/update-product.dto';
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

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  //   return this.productsService.update(id, updateProductDto);
  // }

  //   @Delete(':id')
  //   remove(@Param('id') id: string) {
  //     return this.productsService.remove(id);
  //   }
}
