import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from './create-product.command';
import { PrismaService } from 'src/prisma/prisma.service';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: CreateProductCommand): Promise<any> {
    const { createProductDto } = command;

    // This create operation assumes a specific Prisma schema structure.
    // Adjustments may be needed if your schema differs.
    return this.prisma.products.create({
      data: {
        name: createProductDto.name,
        slug: createProductDto.slug,
        short_description: createProductDto.shortDescription,
        full_description: createProductDto.fullDescription,
        seller_id: BigInt(createProductDto.sellerId),
        brand_id: BigInt(createProductDto.brandId),
        status: createProductDto.status,

        // details: createProductDto.detail
        //   ? {
        //       create: {
        //         weight: createProductDto.detail.weight,
        //         dimensions: { ...createProductDto.detail.dimensions },
        //         materials: createProductDto.detail.materials,
        //         country_of_origin: createProductDto.detail.country_of_origin,
        //         warranty_info: createProductDto.detail.warranty_info,
        //         care_instructions: createProductDto.detail.care_instructions,
        //         additional_info: { ...createProductDto.detail.additional_info },
        //       },
        //     }
        //   : undefined,

        // prices: createProductDto.price
        //   ? {
        //       create: [
        //         {
        //           base_price: createProductDto.price.base_price,
        //           sale_price: createProductDto.price.sale_price,
        //           cost_price: createProductDto.price.cost_price,
        //           currency: createProductDto.price.currency,
        //           tax_rate: createProductDto.price.tax_rate,
        //         },
        //       ],
        //     }
        //   : undefined,

        categories:
          createProductDto.categories && createProductDto.categories.length > 0
            ? {
                create: createProductDto.categories.map((catDto) => ({
                  is_primary: catDto.is_primary,
                  category: {
                    connect: { id: BigInt(catDto.category_id) },
                  },
                })),
              }
            : undefined,
      },
    });
  }
}
//     option_groups:
//       createProductDto.option_groups &&
//       createProductDto.option_groups.length > 0
//         ? {
//             create: createProductDto.option_groups.map((ogDto) => ({
//               name: ogDto.name,
//               display_order: ogDto.display_order,
//               options: {
//                 create: ogDto.options.map((oDto) => ({
//                   name: oDto.name,
//                   additional_price: oDto.additional_price,
//                   sku: oDto.sku,
//                   stock: oDto.stock,
//                   display_order: oDto.display_order,
//                 })),
//               },
//             })),
//           }
//         : undefined,

//     images:
//       createProductDto.images && createProductDto.images.length > 0
//         ? {
//             create: createProductDto.images.map((imgDto) => ({
//               url: imgDto.url,
//               alt_text: imgDto.alt_text,
//               is_primary: imgDto.is_primary,
//               display_order: imgDto.display_order,
//               option_id:
//                 imgDto.option_id != null ? BigInt(imgDto.option_id) : null,
//             })),
//           }
//         : undefined,

//     tags:
//       createProductDto.tags && createProductDto.tags.length > 0
//         ? {
//             create: createProductDto.tags.map((tagId) => ({
//               tag: {
//                 connect: { id: BigInt(tagId) },
//               },
//             })),
//           }
//         : undefined,
//   },
//   include: {
//     details: true,
//     prices: true,
//     categories: { include: { category: true } },
//     option_groups: { include: { options: true } },
//     images: true,
//     tags: { include: { tag: true } },
//   },
// });
//   }
// }
