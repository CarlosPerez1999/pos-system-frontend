import { Component, effect, inject, input, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../services/users-service';
import {
  User,
  UserCreate,
  UserUpdate,
} from '../../../../core/models/user.model';
import { AppInputForm } from '../../../../shared/components/app-input-form/app-input-form';
import { AppButton } from '../../../../shared/components/app-button/app-button';
import { ModalService } from '../../../../core/services/modal-service';
import { ToastService } from '../../../../core/services/toast-service';

@Component({
  selector: 'user-form',
  imports: [ReactiveFormsModule, AppInputForm, AppButton],
  templateUrl: './user-form.html',
})
/**
 * Form component for adding or editing users.
 * Handles form validation and submission.
 */
export class UserForm {
  usersService = inject(UsersService);
  modalService = inject(ModalService);
  toastService = inject(ToastService);
  user = input<User | null>();
  fb = inject(FormBuilder);
  isEditMode = computed(() => !!this.user());

  userForm = this.fb.group({
    name: this.fb.control<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    username: this.fb.control<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    email: this.fb.control<string>('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: this.fb.control<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    role: this.fb.control<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    isActive: this.fb.control<boolean>(true, {
      nonNullable: true,
    }),
  });

  /**
   * Effect to reset or populate the form based on the modal state and selected user.
   */
  formEffect = effect(() => {
    if (!this.modalService.isOpen('create-user')) {
      this.userForm.reset();
    }
    const us = this.user();
    if (us) {
      // En modo edición, remover el validador required del password
      this.userForm.controls.password.clearValidators();
      this.userForm.controls.password.updateValueAndValidity();

      this.userForm.patchValue({
        name: us.name,
        username: us.username,
        email: us.email,
        password: '',
        role: us.role,
        isActive: us.isActive,
      });
      this.userForm.markAsPristine();
      this.userForm.markAsUntouched();
    } else {
      // En modo creación, establecer password como requerido
      this.userForm.controls.password.setValidators([Validators.required]);
      this.userForm.controls.password.updateValueAndValidity();
      this.userForm.reset();
    }
  });

  /**
   * Submits the form to create or update a user.
   * Handles success and error responses with toasts.
   */
  onSubmit() {
    if (this.userForm.valid) {
      if (!this.user()) {
        const newUser: UserCreate = this.userForm.getRawValue() as UserCreate;
        this.usersService.createUser(newUser).subscribe({
          next: () => {
            this.modalService.closeModal('create-user');
            this.toastService.showToast({
              type: 'success',
              message: 'User added successfully',
            });
          },
          error: (err) => {
            console.error(err);
            this.toastService.showToast({
              type: 'error',
              message: 'Failed to add user',
            });
            this.modalService.closeModal('create-user');
          },
        });
      }
    }
    const updatedUser: UserUpdate = this.getChangedFields();
    if (Object.keys(updatedUser).length === 0) {
      this.modalService.closeModal('update-user');
      this.toastService.showToast({
        type: 'info',
        message: 'The user was not updated as no changes were detected.',
      });
      return;
    }
    this.usersService.updateUser(this.user()!.id, updatedUser).subscribe({
      next: () => {
        this.modalService.closeModal('update-user');
        this.toastService.showToast({
          type: 'success',
          message: 'User updated successfully',
        });
        this.userForm.reset();
        this.modalService.closeModal('edit-user');
      },
      error: (err) => {
        this.toastService.showToast({
          type: 'error',
          message: 'Failed to update user',
        });
        this.modalService.closeModal('edit-user');
      },
    });
  }
  /**
   * Identifies fields that have changed between the original and current form values.
   * @returns An object containing only the changed fields.
   */
  protected getChangedFields(): Partial<User> {
    const changes: Partial<User> = {};
    const currentValue = this.userForm.getRawValue();
    const originalValue = this.user()!;

    Object.keys(this.userForm.controls).forEach((key) => {
      const currentVal = currentValue[key as keyof typeof currentValue];
      const originalVal = originalValue[key as keyof typeof originalValue];

      // En modo edición, no enviar password si está vacío
      if (key === 'password' && this.isEditMode() && !currentVal) {
        return;
      }

      if (currentVal !== originalVal) {
        changes[key as keyof User] = currentVal as any;
      }
    });
    return changes;
  }
}
