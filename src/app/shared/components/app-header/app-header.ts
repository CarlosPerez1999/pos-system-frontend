import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { AppButton } from '../app-button/app-button';
import { ThemeService } from '../../../core/services/theme-service';
import { AppIcon } from '../app-icon/app-icon';
import { AuthService } from '../../../auth/auth-service';
import { Router } from '@angular/router';
import { CartService } from '../../../features/sales/services/cart-service';
import { ModalService } from '../../../core/services/modal-service';
import { ConfigurationService } from '../../../features/admin/services/configuration-service';

@Component({
  selector: 'app-header',
  imports: [AppButton, AppIcon],
  templateUrl: './app-header.html',
})
/**
 * Header component containing the application title, theme toggle, and user actions.
 */
export class AppHeader implements OnInit {
  private defaultTitle = 'POS System';
  storeName = signal<string>(this.defaultTitle);
  title = computed(
    () =>
      this.configurationService.configuration$()?.storeName || this.defaultTitle
  );
  subTitle = input<string>('');
  currentUser = signal<string>('');
  themeService = inject(ThemeService);
  authService = inject(AuthService);
  cartService = inject(CartService);
  modalService = inject(ModalService);
  router = inject(Router);
  configurationService = inject(ConfigurationService);

  ngOnInit(): void {
    this.loadConfiguration();
    this.loadCurrentUser();
  }

  /**
   * Loads the store configuration to display the store name.
   * Falls back to default title if configuration is not available.
   * Backend creates configuration automatically when needed.
   */
  loadConfiguration() {
    this.configurationService.getConfiguration().subscribe({
      next: (config) => {
        if (config?.storeName) {
          this.storeName.set(config.storeName);
        }
      },
      error: () => {
        // Configuration doesn't exist yet or error loading
        // Keep default title, backend will create config when user saves
        this.storeName.set(this.defaultTitle);
      },
    });
  }

  /**
   * Loads the current user information from token validation.
   */
  loadCurrentUser() {
    this.authService.validateToken().subscribe({
      next: (me) => {
        if (me?.payload?.name) {
          this.currentUser.set(me.payload.name);
        }
      },
      error: () => {
        // User not logged in or token invalid
        this.currentUser.set('');
      },
    });
  }

  /**
   * Opens the change password modal.
   */
  openChangePasswordModal() {
    this.modalService.openModal('change-password');
  }

  /**
   * Logs out the current user, clears the cart, and redirects to the login page.
   */
  logout() {
    this.router.navigate(['/']);
    localStorage.removeItem('jwt');
    this.cartService.clearCart();
  }
}
