import {
  Component,
  inject,
  input,
  signal,
  computed,
  ChangeDetectionStrategy,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../features/products/services/products-service';
import { AppInfiniteScroll } from '../../directives/app-infinite-scroll';

@Component({
  selector: 'app-grid',
  imports: [AppInfiniteScroll, CommonModule],
  templateUrl: './app-grid.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Grid component for displaying products with infinite scroll support.
 * Adapts column count based on screen width.
 */
export class ProductsGrid {
  productsService = inject(ProductsService);
  loadMore = input.required<() => void>();

  // Configuration signals
  itemCount = input(0);
  isLoading = input(false);
  columns = input(4);

  // Screen size signal for responsive columns
  screenWidth = signal(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  // Computed signals
  isEmpty = computed(() => this.itemCount() === 0 && !this.isLoading());

  // Computed responsive columns
  // Computed responsive columns
  /**
   * Calculates the number of columns based on the current screen width.
   * Returns 2 for small screens, 3 for medium, and 4 for large screens.
   */
  responsiveColumns = computed(() => {
    const width = this.screenWidth();
    if (width < 640) return 2; // Pantallas chicas (< sm)
    if (width < 1024) return 3; // Pantallas medianas (sm a lg)
    return 4; // Pantallas grandes (lg+)
  });

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth.set(window.innerWidth);
  }
}
