import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async insertProduct(title: string, description: string, price: number) {
    const newProduct = new this.productModel({
      title: title,
      description: description,
      price: price,
    });

    const result = await newProduct.save();

    return result.id as string;
  }

  async getAllProducts() {
    const products = await this.productModel.find().exec();
    return products.map(prod => ({
      id: prod.id,
      title: prod.title,
      description: prod.description,
      price: prod.price,
    }));
  }

  async getProduct(id: string) {
    const product = await this.findProduct(id);

    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
    };
  }

  async updateProduct(
    id: string,
    title: string,
    description: string,
    price: number,
  ) {
    const product = await this.findProduct(id);

    if (title) {
      product.title = title;
    }
    if (description) {
      product.description = description;
    }
    if (price) {
      product.price = price;
    }

    product.save();
  }

  async removeProduct(id: string) {
    const result = await this.productModel.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0)
      throw new NotFoundException('Could not find product');
  }

  private async findProduct(id: string): Promise<Product> {
    let product;
    try {
      product = await this.productModel.findById(id).exec();
    } catch (err) {
      throw new NotFoundException('Could not find product');
    }

    if (!product) {
      throw new NotFoundException('Could not find product');
    }

    return product;
  }
}
