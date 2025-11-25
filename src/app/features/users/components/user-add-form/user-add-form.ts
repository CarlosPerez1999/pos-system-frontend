import { Component, effect, inject, input } from '@angular/core';
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
  selector: 'user-add-form',
  imports: [ReactiveFormsModule, AppInputForm, AppButton],
  templateUrl: './user-add-form.html',
})
/**
 * Form component for adding or editing users.
 * Handles form validation and submission.
 */
export class UserAddForm {
  usersService = inject(UsersService);
  modalService = inject(ModalService);
  toastService = inject(ToastService);
  user = input<User | null>();
  fb = inject(FormBuilder);

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
      this.userForm.patchValue({
        name: us.name,
        username: us.username,
        email: us.email,
        password: us.password,
        role: us.role,
        isActive: us.isActive,
      });
      this.userForm.markAsPristine();
      this.userForm.markAsUntouched();
    } else {
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
          },
        });
      }
    }
    const updatedUser: UserUpdate = this.getChangedFields();
    if (Object.keys(updatedUser).length === 0) {
      this.modalService.closeModal('create-user');
      this.toastService.showToast({
        type: 'info',
        message: 'The user was not updated as no changes were detected.',
      });
      return;
    }
    this.usersService.updateUser(this.user()!.id, updatedUser).subscribe({
      next: () => {
        this.modalService.closeModal('create-user');
        this.toastService.showToast({
          type: 'success',
          message: 'User updated successfully',
        });
        this.userForm.reset();
      },
      error: (err) => {
        this.toastService.showToast({
          type: 'error',
          message: 'Failed to update user',
        });
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

      if (currentVal !== originalVal) {
        changes[key as keyof User] = currentVal as any;
      }
    });
    return changes;
  }
}
