import { Component, inject, input } from '@angular/core';
import { CartItem } from '../../interfaces/cart.interface';
import { AppButton } from '../../../../shared/components/app-button/app-button';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'sales-cart-item',
  imports: [AppButton, CurrencyPipe],
  templateUrl: './cart-item.html',
})
export class Item {
  cartService = inject(CartService);
  item = input.required<CartItem>();
}
