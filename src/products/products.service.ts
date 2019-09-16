import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.model';

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  insertProduct(title: string, description: string, price: number) {
    const prodId = Math.random().toString();
    const newProduct = new Product(prodId, title, description, price);
    this.products.push(newProduct);

    return prodId;
  }

  getAllProducts() {
    return [...this.products];
  }

  getProduct(id: string) {
    const product = this.findProduct(id)[0];

    return { ...product };
  }

  updateProduct(id: string, title: string, description: string, price: number) {
    const [product, index] = this.findProduct(id);  

    this.products[index] = {
      ...product,
      title: title,
      description: description,
      price: price,
    };
  }

  removeProduct(id: string) {
    // const productIndex = this.findProduct(id)[1];
    this.products = this.products.filter(prod => prod.id !== id);
  }

  private findProduct(id: string): [Product, number] {
    const productIndex = this.products.findIndex(product => product.id === id);
    const product = this.products[productIndex];

    if (!product) {
      throw new NotFoundException('Could not find product');
    }

    return [product, productIndex];
  }
}
