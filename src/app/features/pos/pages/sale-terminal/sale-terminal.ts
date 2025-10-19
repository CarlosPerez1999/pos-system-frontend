import { Component, computed, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductsGrid } from '../../../products/components/products-grid/products-grid';
import { ShoppingCart } from '../../../sales/components/shopping-cart/shopping-cart';
import { AppModal } from '../../../../shared/components/app-modal/app-modal';
import { CartService } from '../../../sales/services/cart-service';
import { CurrencyPipe } from '@angular/common';
import { AppButton } from '../../../../shared/components/app-button/app-button';
import { ModalService } from '../../../../core/services/modal-service';
import { SalesService } from '../../../sales/services/sales-service';
import { ToastService } from '../../../../core/services/toast-service';
import { ProductsService } from '../../../products/services/products-service';
import { AppSearchBar } from '../../../../shared/components/app-search-bar/app-search-bar';

@Component({
  selector: 'app-sale-terminal',
  imports: [
    ProductsGrid,
    ShoppingCart,
    AppModal,
    FormsModule,
    CurrencyPipe,
    AppButton,
    AppSearchBar,
  ],
  templateUrl: './sale-terminal.html',
})
export class SaleTerminal {
  cartService = inject(CartService);
  modalService = inject(ModalService);
  salesService = inject(SalesService);
  toastService = inject(ToastService);
  productsService = inject(ProductsService);
  customerPayment = model<number>(NaN);

  calculateChange = computed(() => {
    const payment = this.customerPayment();
    const total = this.cartService.total();

    if (isNaN(payment) || payment <= total) return 0;
    return payment - total;
  });

  confirmSale() {
    const products = this.cartService.getProducts();

    this.salesService.createSale(products()).subscribe({
      next: () => {
        this.customerPayment.set(0);
        this.modalService.closeModal('sale-confirmation');
        this.toastService.showToast({
          type: 'success',
          message: 'Sale completed successfully',
        });
        this.cartService.clearCart();
      },
      error: (err) => {
        this.modalService.closeModal('sale-confirmation');
        this.toastService.showToast({
          type: 'error',
          message: `Sale could not be processed: ${err.error.message}`,
        });
        console.error('Error creating sale:', err);
      },
    });
  }

  canConfirmSale = computed(() => {
    const payment = this.customerPayment();
    const total = this.cartService.total();

    return !isNaN(payment) && payment >= total;
  });

  cancelSale() {
    this.customerPayment.set(NaN);
    this.modalService.closeModal('sale-confirmation');
  }

  searchProduct(query: string) {
    this.productsService.setSearchQuery(query);
  }
}
