import { Component, computed, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast-service';
import { NgClass } from '@angular/common';
import { AppIcon } from '../app-icon/app-icon';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgClass, AppIcon],
  templateUrl: './app-toast.html',
})
/**
 * Toast component for displaying notifications.
 * Subscribes to ToastService to show/hide messages.
 */
export class AppToast {
  private toastService = inject(ToastService);

  isOpen = this.toastService.isOpen;
  toastData = this.toastService.toastData;

  typeClasses = {
    info: 'bg-info',
    error: 'bg-error',
    warning: 'bg-warning',
    success: 'bg-success',
  };

  /**
   * Computes the icon name based on the toast type.
   */
  toastIcon = computed(() => {
    const type = this.toastData()?.type ?? 'info';
    switch (type) {
      case 'info':
        return 'line-md:alert-circle';
      case 'error':
        return 'line-md:close-circle';
      case 'warning':
        return 'line-md:alert';
      case 'success':
        return 'line-md:circle-to-confirm-circle-transition';
      default:
        return 'line-md:alert-circle';
    }
  });
  toastStyle = computed(() => {
    const type = this.toastData()?.type ?? 'info';
    return this.typeClasses[type];
  });
}
