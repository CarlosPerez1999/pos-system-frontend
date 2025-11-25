import { Component, effect, inject, input } from '@angular/core';
import { ModalService } from '../../../../core/services/modal-service';
import { ToastService } from '../../../../core/services/toast-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InventoryMovementCreate } from '../../../../core/models/inventory.model';
import { InventoryService } from '../../services/inventory-service';
import { AppInputForm } from '../../../../shared/components/app-input-form/app-input-form';
import { AppButton } from '../../../../shared/components/app-button/app-button';
import { ProductsService } from '../../../products/services/products-service';

@Component({
  selector: 'inventory-movement-form',
  imports: [ReactiveFormsModule, AppInputForm, AppButton],
  templateUrl: './inventory-movement-form.html',
})
/**
 * Form component for creating inventory movements (stock in/out).
 * Handles form validation and submission.
 */
export class InventoryMovementForm {
  inventoryService = inject(InventoryService);
  productsService = inject(ProductsService);
  modalService = inject(ModalService);
  toastService = inject(ToastService);
  productId = input.required<string | null>();
  fb = inject(FormBuilder);

  /**
   * Effect to update the selected product in the service when the input changes.
   */
  selectedProductEffect = effect(() => {
    const productId = this.productId();
    if (!productId) return;
    this.productsService.setSelectedProductId(productId);
  });

  inventoryMovementForm = this.fb.group({
    quantity: this.fb.control<number>(0, {
      validators: [Validators.required, Validators.min(1)],
      nonNullable: true,
    }),
    movementType: this.fb.control<'IN' | 'OUT'>('IN', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    description: this.fb.control<string>('', {
      validators: [Validators.maxLength(255)],
      nonNullable: true,
    }),
  });

  /**
   * Effect to reset the form when the modal is closed.
   */
  formEffect = effect(() => {
    if (!this.modalService.isOpen('create-product')) {
      this.inventoryMovementForm.reset();
    }
  });

  /**
   * Submits the form to create a new movement.
   * Reloads product data on success.
   */
  onSubmit() {
    if (this.inventoryMovementForm.valid) {
      const productId = this.productId();
      if (!productId) return;
      const newMovement: InventoryMovementCreate = {
        ...this.inventoryMovementForm.getRawValue(),
        productId,
      };
      this.inventoryService.createMovement(newMovement).subscribe({
        next: () => {
          this.modalService.closeModal('adjust-stock');
          this.toastService.showToast({
            type: 'success',
            message: 'Adjustment made successfully',
          });
          this.inventoryMovementForm.reset();
          this.productsService.productsResource.reload();
        },
        error: (err) => {
          this.toastService.showToast({
            type: 'error',
            message: 'Failed to perform adjustment',
          });
          this.modalService.closeModal('adjust-stock');
        },
      });
    }
  }
}
