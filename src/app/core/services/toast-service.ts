import { Injectable, signal } from '@angular/core';

export type Toast = {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
};

@Injectable({
  providedIn: 'root',
})
/**
 * Service to display toast notifications.
 * Manages the visibility and content of the toast component.
 */
export class ToastService {
  isOpen = signal(false);
  toastData = signal<Toast | null>(null);

  /**
   * Shows a toast notification with the provided data.
   * Automatically hides the toast after 4 seconds.
   * @param data The toast configuration (type and message).
   */
  showToast(data: Toast) {
    this.toastData.set(data);
    this.isOpen.set(true);

    setTimeout(() => {
      this.toastData.set(null);
      this.isOpen.set(false);
    }, 4000);
  }
}
