import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/auth-service';
import { ToastService } from '../../../core/services/toast-service';
import { ModalService } from '../../../core/services/modal-service';
import { AppInputForm } from '../app-input-form/app-input-form';
import { AppButton } from '../app-button/app-button';
import { AppModal } from '../app-modal/app-modal';
import { passwordMatchValidator } from '../../validators/password-match.validator';

@Component({
  selector: 'app-change-password-modal',
  imports: [ReactiveFormsModule, AppInputForm, AppButton, AppModal],
  template: `
    <app-modal type="info" modalId="change-password" title="Change Password">
      <div content class="flex flex-col gap-4">
        <p class="text-sm text-muted">
          Enter your current password and choose a new password.
        </p>

        <form [formGroup]="changePasswordForm" class="flex flex-col gap-4">
          <app-input-form
            [control]="changePasswordForm.controls.oldPassword"
            label="Current Password"
            inputName="oldPassword"
            type="password"
          >
          </app-input-form>

          <app-input-form
            [control]="changePasswordForm.controls.newPassword"
            label="New Password"
            inputName="newPassword"
            type="password"
          >
          </app-input-form>

          <app-input-form
            [control]="changePasswordForm.controls.confirmPassword"
            label="Confirm New Password"
            inputName="confirmPassword"
            type="password"
          >
          </app-input-form>

          @if (changePasswordForm.hasError('passwordMismatch') &&
          changePasswordForm.get('confirmPassword')?.touched) {
          <p class="text-xs text-destructive -mt-2">Passwords do not match</p>
          }
        </form>

        <div class="flex justify-end gap-3 mt-2">
          <app-button variant="ghost" (clickEmitter)="onCancel()">
            <span label>Cancel</span>
          </app-button>
          <app-button (clickEmitter)="onSubmit()" [disabled]="isChanging()">
            <span label>
              {{ isChanging() ? 'Changing...' : 'Change Password' }}
            </span>
          </app-button>
        </div>
      </div>
    </app-modal>
  `,
})
/**
 * Change Password Modal Component
 *
 * Allows authenticated users to change their password.
 * Requires verification of the current password before setting a new one.
 *
 * Features:
 * - Current password verification
 * - New password with minimum 8 characters
 * - Password confirmation matching validation
 * - Real-time validation feedback
 * - Success/error toast notifications
 */
export class ChangePasswordModal {
  authService = inject(AuthService);
  toastService = inject(ToastService);
  modalService = inject(ModalService);
  fb = inject(FormBuilder);

  isChanging = signal(false);

  changePasswordForm = this.fb.group(
    {
      oldPassword: this.fb.control<string>('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      newPassword: this.fb.control<string>('', {
        validators: [Validators.required, Validators.minLength(8)],
        nonNullable: true,
      }),
      confirmPassword: this.fb.control<string>('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
    },
    { validators: passwordMatchValidator('newPassword', 'confirmPassword') }
  );

  /**
   * Submits the password change request.
   * Validates form, calls API, and provides user feedback.
   */
  onSubmit() {
    if (this.changePasswordForm.valid) {
      this.isChanging.set(true);
      const { oldPassword, newPassword } =
        this.changePasswordForm.getRawValue();

      this.authService.changePassword({ oldPassword, newPassword }).subscribe({
        next: () => {
          this.isChanging.set(false);
          this.modalService.closeModal('change-password');
          this.toastService.showToast({
            type: 'success',
            message: 'Password changed successfully',
          });
          this.changePasswordForm.reset();
        },
        error: (err) => {
          this.isChanging.set(false);
          console.error('Change password error:', err);
          this.toastService.showToast({
            type: 'error',
            message: err.error?.message || 'Failed to change password',
          });
        },
      });
    } else {
      this.toastService.showToast({
        type: 'warning',
        message: 'Please fill in all fields correctly',
      });
    }
  }

  /**
   * Closes the modal and resets the form.
   */
  onCancel() {
    this.modalService.closeModal('change-password');
    this.changePasswordForm.reset();
  }
}
