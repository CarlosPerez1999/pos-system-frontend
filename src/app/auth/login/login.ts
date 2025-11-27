import { Component, inject, signal } from '@angular/core';
import { AppInputForm } from '../../shared/components/app-input-form/app-input-form';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppButton } from '../../shared/components/app-button/app-button';
import { AppIcon } from '../../shared/components/app-icon/app-icon';
import { AuthService } from '../auth-service';
import { Router } from '@angular/router';
import { Me } from '../../core/models/user.model';
import { ToastService } from '../../core/services/toast-service';
import { AppModal } from '../../shared/components/app-modal/app-modal';
import { ModalService } from '../../core/services/modal-service';

@Component({
  selector: 'app-login',
  imports: [AppInputForm, ReactiveFormsModule, AppButton, AppIcon, AppModal],
  templateUrl: './login.html',
})
/**
 * Login Component
 *
 * Handles user authentication with username and password.
 * Provides a form for credentials input and password recovery.
 *
 * Features:
 * - Secure JWT-based authentication
 * - Role-based redirection (admin/cashier)
 * - Forgot password flow (mock - displays reset link in console)
 *
 * Note: Password reset emails are simulated. The reset link
 * is displayed in the backend console, not sent via email.
 */
export class Login {
  authService = inject(AuthService);
  router = inject(Router);
  toastService = inject(ToastService);
  modalService = inject(ModalService);
  errorMessage = signal('');
  isResettingPassword = signal(false);

  fb = inject(FormBuilder);
  loginForm = this.fb.group({
    username: this.fb.control<string>('', {
      validators: [Validators.required, Validators.minLength(2)],
      nonNullable: true,
    }),
    password: this.fb.control<string>('', {
      validators: [Validators.required, Validators.minLength(8)],
      nonNullable: true,
    }),
  });

  resetPasswordForm = this.fb.group({
    email: this.fb.control<string>('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
  });

  /**
   * Submits the login form.
   * On success, validates the token and redirects based on user role.
   * On failure, displays an error toast.
   */
  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.getRawValue()).subscribe({
        next: () => {
          this.authService.validateToken().subscribe({
            next: (me: Me) => {
              if (me.payload.role === 'admin') {
                this.router.navigate(['/admin']);
              } else {
                this.router.navigate(['/pos']);
              }
            },
            error: (err) => {
              console.error('Error validating token:', err);
              this.router.navigate(['/']);
            },
          });
        },
        error: (err) => {
          console.error('Login error:', err);
          this.toastService.showToast({
            type: 'error',
            message: 'Incorrect username or password',
          });
        },
      });
    }
  }

  /**
   * Opens the password recovery modal.
   */
  onForgotPassword() {
    this.resetPasswordForm.reset();
    this.modalService.openModal('reset-password');
  }

  /**
   * Submits the password reset request.
   * Sends the email to the API and shows success/error feedback.
   * Note: Email service is mocked - link appears in backend console.
   */
  onSubmitPasswordReset() {
    if (this.resetPasswordForm.valid) {
      this.isResettingPassword.set(true);
      const email = this.resetPasswordForm.getRawValue().email;

      this.authService.requestPasswordReset(email).subscribe({
        next: () => {
          this.isResettingPassword.set(false);
          this.modalService.closeModal('reset-password');
          this.toastService.showToast({
            type: 'success',
            message: 'Check the server console for the reset link',
          });
          this.resetPasswordForm.reset();
        },
        error: (err) => {
          this.isResettingPassword.set(false);
          console.error('Password reset error:', err);
          this.toastService.showToast({
            type: 'error',
            message: 'Failed to send password reset email',
          });
        },
      });
    } else {
      this.toastService.showToast({
        type: 'warning',
        message: 'Please enter a valid email address',
      });
    }
  }
}
