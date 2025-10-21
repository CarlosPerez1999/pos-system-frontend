import { Component, inject, input } from '@angular/core';
import { ProductsService } from '../../../features/products/services/products-service';
import { AppInfiniteScroll } from '../../directives/app-infinite-scroll';

@Component({
  selector: 'app-grid',
  imports: [AppInfiniteScroll],
  templateUrl: './app-grid.html',
})
export class ProductsGrid {
  productsService = inject(ProductsService);
  loadMore = input.required<() => void>();
}
