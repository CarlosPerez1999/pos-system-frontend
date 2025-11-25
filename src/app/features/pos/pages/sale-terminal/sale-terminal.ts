import { Component, computed, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductsGrid } from '../../../../shared/components/app-grid/app-grid';
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
import { ProductCard } from '../../../products/components/product-card/product-card';

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
    ProductCard,
  ],
  host: {
    class: 'h-full',
  },
  templateUrl: './sale-terminal.html',
})
/**
 * Sale Terminal page for processing sales in the POS system.
 * Manages the shopping cart, product selection, and payment processing.
 */
export class SaleTerminal {
  cartService = inject(CartService);
  modalService = inject(ModalService);
  salesService = inject(SalesService);
  toastService = inject(ToastService);
  productsService = inject(ProductsService);
  customerPayment = model<number>(NaN);
  cartItemsCount = computed(() => this.cartService.getProducts()().length);

  /**
   * Calculates the change to give back to the customer.
   * Returns 0 if payment is insufficient or invalid.
   */
  calculateChange = computed(() => {
    const payment = this.customerPayment();
    const total = this.cartService.total();

    if (isNaN(payment) || payment <= total) return 0;
    return payment - total;
  });

  openCartModal() {
    this.modalService.openModal('mobile-cart');
  }

  closeCartModal() {
    this.modalService.closeModal('mobile-cart');
  }

  /**
   * Confirms and processes the sale.
   * Sends the cart items to the backend and clears the cart on success.
   */
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

  /**
   * Checks if the sale can be confirmed based on payment amount.
   */
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

  onLoadMore = () => {
    this.productsService.nextPage();
  };
}
