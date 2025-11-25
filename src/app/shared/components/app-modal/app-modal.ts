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
/**
 * Modal component that can be styled based on type (info, error, warning, success).
 * Uses ModalService to manage its open/close state.
 */
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

  /**
   * Computes the CSS class for the title background based on the modal type.
   */
  titleStyle = computed(() => {
    return `${this.types[this.type()]}`;
  });

  /**
   * Closes the modal via the service and emits the onClose event.
   */
  close() {
    this.modalService.closeModal(this.modalId());
    this.onClose.emit();
  }
}
