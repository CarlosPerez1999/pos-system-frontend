import { Component, computed, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductsGrid } from '../../../products/components/products-grid/products-grid';
import { ShoppingCart } from '../../../sales/components/shopping-cart/shopping-cart';
import { AppModal } from '../../../../shared/components/app-modal/app-modal';
import { CartService } from '../../../sales/services/cart-service';
import { CurrencyPipe } from '@angular/common';
import { AppButton } from '../../../../shared/components/app-button/app-button';
import { ModalService } from '../../../../core/services/modal-service';

@Component({
  selector: 'app-sale-terminal',
  imports: [
    ProductsGrid,
    ShoppingCart,
    AppModal,
    FormsModule,
    CurrencyPipe,
    AppButton,
  ],
  templateUrl: './sale-terminal.html',
})
export class SaleTerminal {
  cartService = inject(CartService);
  modalService = inject(ModalService);
  customerPayment = model<number>(NaN);

  calculateChange = computed(() => {
    const payment = this.customerPayment();
    const total = this.cartService.total();

    if (isNaN(payment) || payment <= total) return 0;
    return payment - total;
  });

  cancelSale() {
    this.customerPayment.set(0);
    this.modalService.closeModal('sale-confirmation');
  }
}
