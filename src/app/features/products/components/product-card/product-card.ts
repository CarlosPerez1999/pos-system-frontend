import { Component, inject, input } from '@angular/core';
import { Product } from '../../../../core/models/product.model';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../sales/services/cart-service';

@Component({
  selector: 'product-card',
  imports: [CurrencyPipe],
  templateUrl: './product-card.html',
})
export class ProductCard {
  product = input.required<Product>();
  cartService = inject(CartService);

  addProductToCart() {
    this.cartService.addProduct(this.product());
    console.log(this.cartService.getProducts());
  }
}
