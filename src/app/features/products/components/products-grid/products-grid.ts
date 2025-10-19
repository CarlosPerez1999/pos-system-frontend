import { Component, inject, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products-service';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'products-grid',
  imports: [ProductCard],
  templateUrl: './products-grid.html',
})
export class ProductsGrid {
  productsService = inject(ProductsService);
}
