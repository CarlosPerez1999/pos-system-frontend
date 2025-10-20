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

@Component({
  selector: 'products-grid',
  imports: [ProductCard],
  templateUrl: './products-grid.html',
})
export class ProductsGrid {
  productsService = inject(ProductsService);

  sentinelRef = viewChild<ElementRef<HTMLDivElement>>('sentinel');

  observer = effect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && this.productsService.hasMore()) {
          this.productsService.nextPage();
        }
      });
    });
    const sentinel = this.sentinelRef();
    if (!sentinel?.nativeElement) return;
    observer.observe(sentinel.nativeElement);
  });
}
