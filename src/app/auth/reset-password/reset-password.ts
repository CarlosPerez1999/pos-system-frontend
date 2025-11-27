import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth-service';
import { ToastService } from '../../core/services/toast-service';
import { AppInputForm } from '../../shared/components/app-input-form/app-input-form';
import { AppButton } from '../../shared/components/app-button/app-button';
import { AppIcon } from '../../shared/components/app-icon/app-icon';
import { passwordMatchValidator } from '../../shared/validators/password-match.validator';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, AppInputForm, AppButton, AppIcon],
  templateUrl: './reset-password.html',
})
/**
 * Reset Password Page Component
 *
 * This component handles the password reset flow using a token-based approach.
 * Users arrive at this page via a link sent to their email after requesting
 * a password reset through the forgot-password flow.
 *
 * Flow:
 * 1. User clicks reset link in email (contains token in URL query params)
 * 2. Component extracts and validates token presence
 * 3. User enters new password and confirmation
 * 4. On submit, token and new password are sent to backend
 * 5. Backend validates token (15-minute expiration) and resets password
 * 6. On success, user is redirected to login page
 *
 * Security Notes:
 * - Token expires after 15 minutes (backend enforcement)
 * - Password must be minimum 8 characters
 * - Password confirmation must match
 * - Invalid/expired tokens are handled gracefully
 */
export class ResetPasswordPage implements OnInit {
  authService = inject(AuthService);
  toastService = inject(ToastService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  fb = inject(FormBuilder);

  isResetting = signal(false);
  token = signal<string | null>(null);

  resetPasswordForm = this.fb.group(
    {
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

  ngOnInit(): void {
    // Extract token from query parameters (e.g., /auth/reset-password?token=xyz)
    this.route.queryParams.subscribe((params) => {
      const tokenFromUrl = params['token'];
      if (tokenFromUrl) {
        this.token.set(tokenFromUrl);
      } else {
        this.toastService.showToast({
          type: 'error',
          message: 'Invalid or missing reset token',
        });
        // Redirect to login after a delay
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      }
    });
  }

  /**
   * Submits the password reset request.
   */
  onSubmit() {
    if (!this.token()) {
      this.toastService.showToast({
        type: 'error',
        message: 'Invalid reset token',
      });
      return;
    }

    if (this.resetPasswordForm.valid) {
      this.isResetting.set(true);
      const { newPassword } = this.resetPasswordForm.getRawValue();

      this.authService
        .resetPassword({ token: this.token()!, newPassword })
        .subscribe({
          next: () => {
            this.isResetting.set(false);
            this.toastService.showToast({
              type: 'success',
              message: 'Password reset successfully. Redirecting to login...',
            });
            setTimeout(() => this.router.navigate(['/auth/login']), 2000);
          },
          error: (err) => {
            this.isResetting.set(false);
            console.error('Reset password error:', err);
            this.toastService.showToast({
              type: 'error',
              message: err.error?.message || 'Failed to reset password',
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
}
