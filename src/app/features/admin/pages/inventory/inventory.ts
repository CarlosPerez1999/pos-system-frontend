import { Component, inject, OnDestroy, signal } from '@angular/core';
import {
  AppTable,
  TableColumn,
} from '../../../../shared/components/app-table/app-table';
import { ProductsService } from '../../../products/services/products-service';
import { AppButton } from '../../../../shared/components/app-button/app-button';
import { AppIcon } from '../../../../shared/components/app-icon/app-icon';
import { AppSearchBar } from '../../../../shared/components/app-search-bar/app-search-bar';
import { Product } from '../../../../core/models/product.model';
import { AppModal } from '../../../../shared/components/app-modal/app-modal';
import { ModalService } from '../../../../core/services/modal-service';
import { ToastService } from '../../../../core/services/toast-service';
import { InventoryMovementForm } from "../../../inventory/components/inventory-movement-form/inventory-movement-form";

@Component({
  selector: 'app-inventory',
  imports: [AppTable, AppButton, AppIcon, AppSearchBar, AppModal, InventoryMovementForm],
  templateUrl: './inventory.html',
})
export class InventoryPage implements OnDestroy {
  productsService = inject(ProductsService);
  modalService = inject(ModalService);
  toastService = inject(ToastService);
  selectedProduct = signal<string | null>(null);
  productCols: TableColumn<Product>[] = [
    {
      key: 'sku',
      label: 'SKU',
    },
    {
      key: 'name',
      label: 'Product',
    },
    {
      key: 'stock',
      label: 'Stock',
    },
    {
      key: 'isActive',
      label: 'Status',
      format: (val) => (val ? 'Active' : 'Inactive'),
    },
  ];

  openAdjustmentForm() {
    const selectedProduct = this.selectedProduct()
    if (!selectedProduct) {
      this.toastService.showToast({
        type: 'info',
        message: 'Please select a product to make an adjustment',
      });
      return
    }

    this.modalService.openModal('adjust-stock');
  }

  ngOnDestroy(): void {
    this.productsService.setSearchQuery('');
  }
}
