import {
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ProductsService } from '../../../features/products/services/products-service';
import { AppIcon } from '../app-icon/app-icon';
import { AppButton } from '../app-button/app-button';
import { NgClass } from '@angular/common';

/**
 * Interface defining the structure of a table column.
 * @template T The type of data in the table.
 */
export interface TableColumn<T> {
  key: keyof T;
  label: string;
  format?: (value: T[keyof T], item?: T) => string;
}

@Component({
  selector: 'app-table',
  imports: [AppIcon, AppButton, NgClass],
  templateUrl: './app-table.html',
})
/**
 * Generic table component with pagination and selection support.
 * @template T The type of data displayed in the table.
 */
export class AppTable<T> {
  protected productsService = inject(ProductsService);
  protected readonly currentPage = signal(1);
  isSelectable = input<boolean>(true);
  pageSize = input(5);
  columns = input.required<TableColumn<T>[]>();
  items = input.required<any[]>();
  totalItems = input.required<number>();
  nextPageFn = input.required<() => void>();
  hasMore = input.required<boolean>();
  selectedItem = signal<T | null>(null);
  getSelectedItemEmit = output<T | null>();

  /**
   * Calculates the total number of pages based on total items and page size.
   */
  protected maxPage = computed(() => {
    return Math.ceil(this.totalItems() / this.pageSize());
  });

  /**
   * Computes the items to display on the current page.
   */
  protected readonly visibleItems = computed(() => {
    const all = this.items();
    const start = (this.currentPage() - 1) * this.pageSize();
    return all.slice(start, start + this.pageSize());
  });

  /**
   * Navigates to the next page.
   * Fetches more data if available and needed.
   */
  protected goToNextLocalPage() {
    const localMaxPage = Math.ceil(this.items().length / this.pageSize());
    if (this.currentPage() < localMaxPage) {
      this.currentPage.update((p) => p + 1);
    } else if (this.hasMore()) {
      this.nextPageFn()();
      this.currentPage.update((p) => p + 1);
    }
  }

  protected goToPreviousLocalPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
    }
  }

  /**
   * Handles item selection and emits the selected item.
   * @param item The selected item.
   */
  getSelectedItem(item: T) {
    this.selectedItem.set(item);
    this.getSelectedItemEmit.emit(this.selectedItem());
  }
}
