import { Component, computed, inject, input, signal } from '@angular/core';
import { ModalService } from '../../../core/services/modal-service';
import { AppButton } from '../app-button/app-button';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-modal',
  imports: [AppButton, NgClass],
  templateUrl: './app-modal.html',
})
export class AppModal {
  modalId = input.required<string>();
  title = input<string>('');
  modalService = inject(ModalService);

  type = input<'info' | 'error' | 'warning' | 'success'>('error');

  types = {
    info: 'bg-blue-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    success: 'bg-green-500',
  };

  titleStyle = computed(() => {
    return `${this.types[this.type()]}`;
  });
}
