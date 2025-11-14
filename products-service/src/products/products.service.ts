import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto, userId: string): Promise<Product> {
    const newProduct = new this.productModel({
      ...createProductDto,
      userId: new Types.ObjectId(userId),
    });
    return newProduct.save();
  }

  async findAll(userId?: string): Promise<Product[]> {
    const filter = userId ? { userId: new Types.ObjectId(userId) } : {};
    return this.productModel.find(filter).exec();
  }

  async findOne(id: string): Promise<Product> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid product ID');
    }

    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, userId: string): Promise<Product> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid product ID');
    }

    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.userId.toString() !== userId) {
      throw new ForbiddenException('You can only update your own products');
    }

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();

    return updatedProduct;
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid product ID');
    }

    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.userId.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own products');
    }

    await this.productModel.findByIdAndDelete(id).exec();
    return { message: 'Product deleted successfully' };
  }
}
