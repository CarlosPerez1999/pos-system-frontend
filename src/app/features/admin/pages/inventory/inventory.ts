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
import { InventoryMovementForm } from '../../../inventory/components/inventory-movement-form/inventory-movement-form';
import { InventoryService } from '../../../inventory/services/inventory-service';
import {
  InventoryMovement,
  InventoryMovementResponse,
} from '../../../../core/models/inventory.model';

@Component({
  selector: 'app-inventory',
  imports: [
    AppTable,
    AppButton,
    AppIcon,
    AppSearchBar,
    AppModal,
    InventoryMovementForm,
  ],
  templateUrl: './inventory.html',
})
/**
 * Inventory page for managing product stock and viewing movements.
 */
export class InventoryPage implements OnDestroy {
  productsService = inject(ProductsService);
  inventoryService = inject(InventoryService);
  modalService = inject(ModalService);
  toastService = inject(ToastService);
  selectedProduct = signal<Product | null>(null);
  productAdjustments = signal<InventoryMovementResponse | null>(null);

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

  adjustmentsCols: TableColumn<InventoryMovement>[] = [
    {
      key: 'createdAt',
      label: 'Date',
      format: (val) => {
        const date = typeof val === 'string' ? new Date(val) : val;
        return date ? date.toLocaleString('es-MX') : '';
      },
    },
    {
      key: 'quantity',
      label: 'Quantity',
    },
    {
      key: 'movementType',
      label: 'Movement Type',
    },
    {
      key: 'description',
      label: 'Description',
    },
  ];

  lowStockCols: TableColumn<Product>[] = [
    {
      key: 'sku',
      label: 'SKU',
    },
    {
      key: 'name',
      label: 'Product',
    },
    {
      key: 'description',
      label: 'Description',
    },
    {
      key: 'stock',
      label: 'Stock',
    },
  ];

  /**
   * Opens the stock adjustment modal for the selected product.
   * Shows a toast if no product is selected.
   */
  openAdjustmentForm() {
    const selectedProduct = this.selectedProduct();
    if (!selectedProduct) {
      this.toastService.showToast({
        type: 'info',
        message: 'Please select a product to make an adjustment',
      });
      return;
    }

    this.modalService.openModal('adjust-stock');
  }

  /**
   * Opens the modal to view stock adjustments history for the selected product.
   */
  openAdjustmentsModal() {
    const selectedProduct = this.selectedProduct();
    if (!selectedProduct) {
      this.toastService.showToast({
        type: 'info',
        message: 'Please select a product to see stock adjustments',
      });
      return;
    }
    this.inventoryService.setProductId(selectedProduct.id);
    this.modalService.openModal('product-adjustments');
  }

  ngOnDestroy(): void {
    this.productsService.setSearchQuery('');
  }
}
