import { Component, input } from '@angular/core';
import { Product } from '../../../../core/models/product.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'product-card',
  imports: [CurrencyPipe],
  templateUrl: './product-card.html',
})
export class ProductCard {
  product = input.required<Product>()
}
