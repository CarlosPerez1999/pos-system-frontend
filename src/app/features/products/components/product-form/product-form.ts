import { Component, computed, effect, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService } from '../../services/products-service';
import {
  Product,
  ProductCreate,
  ProductUpdate,
} from '../../../../core/models/product.model';
import { AppButton } from '../../../../shared/components/app-button/app-button';
import { AppInputForm } from '../../../../shared/components/app-input-form/app-input-form';
import { ModalService } from '../../../../core/services/modal-service';
import { ToastService } from '../../../../core/services/toast-service';

@Component({
  selector: 'product-form',
  imports: [ReactiveFormsModule, AppButton, AppInputForm],
  templateUrl: './product-form.html',
})
export class ProductForm {
  productsService = inject(ProductsService);
  modalService = inject(ModalService);
  toastService = inject(ToastService);
  product = input<Product | null>();
  fb = inject(FormBuilder);

  productForm = this.fb.group({
    name: this.fb.control<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    description: this.fb.control<string | null>(''),
    price: this.fb.control<number | undefined>(undefined, {
      validators: [Validators.required, Validators.min(0)],
      nonNullable: true,
    }),
    stock: this.fb.control<number | undefined>(undefined, {
      validators: [Validators.required, Validators.min(0)],
      nonNullable: true,
    }),
    imageUrl: this.fb.control<string | null>(null),
    sku: this.fb.control<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    barcode: this.fb.control<string | null>(null),
    isActive: this.fb.control<boolean>(true, { nonNullable: true }),
  });

  formEffect = effect(() => {
    if (!this.modalService.isOpen('create-product')) {
      this.productForm.reset();
    }
    const prod = this.product();
    if (prod) {
      this.productForm.patchValue({
        name: prod.name,
        description: prod.description,
        price: prod.price,
        stock: prod.stock,
        imageUrl: prod.imageUrl,
        sku: prod.sku,
        barcode: prod.barcode,
        isActive: prod.isActive,
      });
      this.productForm.markAsPristine();
      this.productForm.markAsUntouched();
    } else {
      this.productForm.reset();
    }
  });

  onSubmit() {
    if (this.productForm.valid) {
      if (!this.product()) {
        const newProduct: ProductCreate =
          this.productForm.getRawValue() as ProductCreate;
        this.productsService.createProduct(newProduct).subscribe({
          next: () => {
            this.modalService.closeModal('create-product');
            this.toastService.showToast({
              type: 'success',
              message: 'Product added successfully',
            });
            this.productForm.reset();
          },
          error: (err) => {
            this.toastService.showToast({
              type: 'error',
              message: 'Failed to add product',
            });
          },
        });
        return;
      }
      const updatedProduct: ProductUpdate = this.getChangedFields();
      if (Object.keys(updatedProduct).length === 0) {
        this.modalService.closeModal('create-product');
        this.toastService.showToast({
          type: 'info',
          message: 'The product was not updated as no changes were detected.',
        });
        return;
      }
      this.productsService
        .updateProduct(this.product()!.id, updatedProduct)
        .subscribe({
          next: () => {
            this.modalService.closeModal('create-product');
            this.toastService.showToast({
              type: 'success',
              message: 'Product updated successfully',
            });
            this.productForm.reset();
          },
          error: (err) => {
            this.toastService.showToast({
              type: 'error',
              message: 'Failed to update product',
            });
          },
        });
    }
  }

  protected getChangedFields(): Partial<Product> {
    const changes: Partial<Product> = {};
    const currentValue = this.productForm.getRawValue();
    const originalValue = this.product()!;

    Object.keys(this.productForm.controls).forEach((key) => {
      const currentVal = currentValue[key as keyof typeof currentValue];
      const originalVal = originalValue[key as keyof typeof originalValue];

      if (currentVal !== originalVal) {
        changes[key as keyof Product] = currentVal as any;
      }
    });
    return changes;
  }
}
