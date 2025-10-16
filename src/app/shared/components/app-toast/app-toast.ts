import { Component, computed, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast-service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgClass],
  templateUrl: './app-toast.html',
})
export class AppToast {
  private toastService = inject(ToastService);

  isOpen = this.toastService.isOpen;
  toastData = this.toastService.toastData;

  typeClasses = {
    info: 'bg-blue-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    success: 'bg-green-500',
  };

  toastStyle = computed(() => {
    const type = this.toastData()?.type ?? 'info';
    return this.typeClasses[type];
  });
}
