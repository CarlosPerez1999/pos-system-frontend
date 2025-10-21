import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ProductsService } from '../../services/products-service';
import { ProductCard } from '../product-card/product-card';
import { AppInfiniteScroll } from '../../../../shared/directives/app-infinite-scroll';

@Component({
  selector: 'products-grid',
  imports: [ProductCard, AppInfiniteScroll],
  templateUrl: './products-grid.html',
})
export class ProductsGrid {
  productsService = inject(ProductsService);

  loadMore = () => {
    this.productsService.nextPage();
  };
}
