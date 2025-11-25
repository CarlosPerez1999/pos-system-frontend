import { Component, inject, OnDestroy, signal } from '@angular/core';
import { AppButton } from '../../../../shared/components/app-button/app-button';
import { AppIcon } from '../../../../shared/components/app-icon/app-icon';
import { ProductsService } from '../../../products/services/products-service';
import { ProductsGrid } from '../../../../shared/components/app-grid/app-grid';
import { AppSearchBar } from '../../../../shared/components/app-search-bar/app-search-bar';
import { AppModal } from '../../../../shared/components/app-modal/app-modal';
import { ProductForm } from '../../../products/components/product-form/product-form';
import { ModalService } from '../../../../core/services/modal-service';
import { Product } from '../../../../core/models/product.model';
import { ToastService } from '../../../../core/services/toast-service';

@Component({
  selector: 'admin-products',
  imports: [
    AppButton,
    AppIcon,
    ProductsGrid,
    AppSearchBar,
    AppModal,
    ProductForm,
  ],
  templateUrl: './products.html',
  host: {
    class: 'h-full flex flex-col',
  },
})
/**
 * Products page for managing the product catalog.
 * Supports creating, editing, and deleting products.
 */
export class ProductsPage implements OnDestroy {
  productsService = inject(ProductsService);
  modalService = inject(ModalService);
  toastService = inject(ToastService);
  products = this.productsService.products$;

  selectedProduct = signal<Product | null>(null);

  loadMoreProducts = () => {
    this.productsService.nextPage();
  };

  /**
   * Opens the modal to create a new product.
   * Resets the selected product.
   */
  onCreateProduct() {
    this.selectedProduct.set(null);
    this.modalService.openModal('create-product');
  }

  /**
   * Opens the modal to edit an existing product.
   * @param product The product to edit.
   */
  onEditProduct(product: Product) {
    this.selectedProduct.set(product);
    this.modalService.openModal('create-product');
  }

  /**
   * Opens the confirmation modal to delete a product.
   * @param product The product to delete.
   */
  onDeleteProduct(product: Product) {
    this.selectedProduct.set(product);
    this.modalService.openModal('delete-product');
  }

  /**
   * Confirms the deletion of the selected product.
   * Calls the service to delete and shows a toast on success/error.
   */
  confirmDelete() {
    const product = this.selectedProduct();
    if (!product) {
      this.selectedProduct.set(null);
      return;
    }
    this.productsService.deleteProduct(product.id).subscribe({
      next: () => {
        this.selectedProduct.set(null);
        this.toastService.showToast({
          type: 'success',
          message: 'Product removed',
        });
        this.modalService.closeModal('delete-product');
      },
      error: (err) => {
        this.selectedProduct.set(null);
        this.toastService.showToast({
          type: 'error',
          message: 'Error when deleting product',
        });
        this.modalService.closeModal('delete-product');
      },
    });
  }
  ngOnDestroy(): void {
    this.productsService.setSearchQuery('');
  }
}
