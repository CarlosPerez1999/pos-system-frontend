import { Component, computed, inject, input, output, signal } from '@angular/core';
import { ProductsService } from '../../../features/products/services/products-service';
import { AppIcon } from '../app-icon/app-icon';
import { AppButton } from '../app-button/app-button';
import { NgClass } from '@angular/common';

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
export class AppTable<T> {
  protected productsService = inject(ProductsService);
  protected readonly currentPage = signal(1);
  protected pageSize = input(5);
  columns = input.required<TableColumn<T>[]>()
  items = input.required<any[]>();
  totalItems = input.required<number>();
  nextPageFn = input.required<() => void>();
  hasMore = input.required<boolean>();
  selectedItem = signal<string | null>(null)
  getSelectedItemEmit  = output<string | null>()

  protected maxPage = computed(() => {
    return Math.ceil(this.totalItems() / this.pageSize());
  });

  protected readonly visibleItems = computed(() => {
    const all = this.items();
    const start = (this.currentPage() - 1) * this.pageSize();
    return all.slice(start, start + this.pageSize());
  });

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

  getSelectedItem(itemId:string){
    this.selectedItem.set(itemId)
    this.getSelectedItemEmit.emit(this.selectedItem())
  }

}
