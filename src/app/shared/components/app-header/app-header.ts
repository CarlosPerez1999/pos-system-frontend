import { Component, inject, input, signal } from '@angular/core';
import { AppButton } from '../app-button/app-button';
import { ThemeService } from '../../../core/services/theme-service';
import { AppIcon } from '../app-icon/app-icon';
import { AuthService } from '../../../auth/auth-service';
import { Router } from '@angular/router';
import { CartService } from '../../../features/sales/services/cart-service';

@Component({
  selector: 'app-header',
  imports: [AppButton, AppIcon],
  templateUrl: './app-header.html',
})
export class AppHeader {
  title = 'POS System';
  subTitle = input<string>('');
  themeService = inject(ThemeService);
  authService = inject(AuthService);
  cartService = inject(CartService);
  router = inject(Router);

  logout() {
    this.router.navigate(['/']);
    localStorage.removeItem('jwt');
    this.cartService.clearCart()
  }
}
