import { Injectable, signal } from '@angular/core';

export type Toast = {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
};

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  isOpen = signal(false);
  toastData = signal<Toast | null>(null);

  showToast(data: Toast) {
    this.toastData.set(data);
    this.isOpen.set(true);

    setTimeout(() => {
      this.toastData.set(null);
      this.isOpen.set(false);
    }, 4000);
  }
}
