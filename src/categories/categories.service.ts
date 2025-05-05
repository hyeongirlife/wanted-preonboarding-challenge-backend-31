import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetCategoryDto } from './dto/get-category.dto';
import { GetCategoryProductDto } from './dto/get-category-product.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(getCategoryDto: GetCategoryDto) {
    return this.prisma.categories.findMany({
      where: {
        level: getCategoryDto.level,
      },
      include: {
        children: true,
      },
    });
  }

  async findProducts(id: string, getCategoryProductDto: GetCategoryProductDto) {
    const { page, perPage, sort, includeSubcategories } = getCategoryProductDto;
    const categoryId = parseInt(id);
    /**
     * @comment 데이터가 적기 때문에 카테고리 조회 후 상품 조회. 그리고 페이지네이션을 주기 편리함.
     */
    const productCategory = await this.prisma.product_categories.findMany({
      where: {
        category_id: categoryId,
      },
    });

    const productIds = productCategory.map((product) => product.product_id);

    const products = await this.prisma.products.findMany({
      where: {
        id: { in: productIds },
      },
      orderBy: {
        [sort.split(':')[0]]: sort.split(':')[1],
      },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return products;
  }
}
