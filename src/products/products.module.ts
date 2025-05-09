import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateProductHandler } from './commands/create-product.handler';

@Module({
  imports: [CqrsModule],
  controllers: [ProductsController],
  providers: [ProductsService, CreateProductHandler],
  exports: [ProductsService],
})
export class ProductsModule {}
