import { Injectable, NotFoundException } from '@nestjs/common';
// import { CreateProductDto } from './dto/create-product.dto';
// import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    return this.prisma.products.create({
      data: {
        name: createProductDto.name,
        slug: createProductDto.slug,
        short_description: createProductDto.shortDescription,
        full_description: createProductDto.fullDescription,
        seller_id: createProductDto.sellerId,
        brand_id: createProductDto.brandId,
        status: createProductDto.status,
        categories: {
          connect: createProductDto.categories.map((category) => ({
            id: category.category_id,
          })),
        },
      },
    });
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const {
      page,
      perPage,
      sort,
      status,
      minPrice,
      maxPrice,
      category,
      seller,
      brand,
      inStock,
      search,
    } = paginationQuery;

    const where: Prisma.productsWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (minPrice || maxPrice) {
      where.prices = {
        some: {
          AND: [
            minPrice ? { base_price: { gte: minPrice } } : {},
            maxPrice ? { base_price: { lte: maxPrice } } : {},
          ],
        },
      };
    }

    if (category && category.length > 0) {
      console.log('category', category);
      // const categoryIds = category.map((id) => BigInt(id));
      where.categories = {
        some: {
          category_id: {
            in: category,
          },
        },
      };
    }

    if (seller) {
      where.seller_id = BigInt(seller);
    }

    if (brand) {
      where.brand_id = BigInt(brand);
    }

    if (inStock) {
      where.option_groups = {
        some: {
          options: {
            some: {
              stock: {
                gt: 0,
              },
            },
          },
        },
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { short_description: { contains: search } },
        { full_description: { contains: search } },
      ];
    }

    const orderBy: Prisma.productsOrderByWithRelationInput[] = [];

    if (sort) {
      const sortArray = sort.split(',');
      sortArray.forEach((sortItem) => {
        const [field, direction] = sortItem.split(':');
        orderBy.push({ [field]: direction === 'desc' ? 'desc' : 'asc' });
      });
    }

    const paginationOptions: Prisma.productsFindManyArgs = {
      where,
      orderBy,
      include: {
        prices: true,
        categories: {
          include: {
            category: true,
          },
        },
        seller: true,
        brand: true,
        option_groups: {
          include: {
            options: true,
          },
        },
      },
    };

    if (page && perPage) {
      const skip = (page - 1) * perPage;
      paginationOptions.skip = skip;
      paginationOptions.take = perPage;
    }

    const [total, products] = await Promise.all([
      this.prisma.products.count({ where }),
      this.prisma.products.findMany(paginationOptions),
    ]);

    if (page && perPage) {
      return {
        total,
        page,
        perPage,
        data: products,
      };
    }

    return {
      total,
      data: products,
    };
  }

  findOne(id: string) {
    const product = this.prisma.products.findUnique({
      where: {
        id: BigInt(id),
      },
      include: {
        seller: true,
        brand: true,
        details: true,
        prices: true,
        categories: {
          include: {
            category: true,
          },
        },
        option_groups: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('🔴 존재하지 않는 상품입니다.');
    }

    return product;
  }

  // update(id: string, updateProductDto: UpdateProductDto) {
  //   const product = this.prisma.products.update({
  //     where: { id: BigInt(id) },
  //     data: updateProductDto,
  //   });

  //   return product;
  // }

  //   remove(id: string) {
  //     return `This action removes a #${id} product`;
  //   }
}
