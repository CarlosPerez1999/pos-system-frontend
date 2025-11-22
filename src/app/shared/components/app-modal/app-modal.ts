import {
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
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
  onClose = output();

  type = input<'info' | 'error' | 'warning' | 'success'>('error');

  types = {
    info: 'bg-info',
    error: 'bg-error',
    warning: 'bg-warning',
    success: 'bg-success',
  };

  titleStyle = computed(() => {
    return `${this.types[this.type()]}`;
  });

  close() {
    this.modalService.closeModal(this.modalId());
    this.onClose.emit();
  }
}
