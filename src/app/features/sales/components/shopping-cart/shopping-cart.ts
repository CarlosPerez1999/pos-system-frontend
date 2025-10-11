import { Component, computed, inject } from '@angular/core';
import { AppButton } from '../../../../shared/components/app-button/app-button';
import { CartService } from '../../services/cart-service';
import { Item } from '../cart-item/cart-item';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'sales-shopping-cart',
  imports: [AppButton, Item, CurrencyPipe],
  templateUrl: './shopping-cart.html',
})
export class ShoppingCart {
  cartService = inject(CartService);
  cartItems = this.cartService.getProducts();

  clearCart() {
    console.log(this.cartItems());
    this.cartService.clearCart();
  }
}
