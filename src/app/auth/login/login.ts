import { Component, inject, signal } from '@angular/core';
import { AppInputForm } from '../../shared/components/app-input-form/app-input-form';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppButton } from '../../shared/components/app-button/app-button';
import { AppIcon } from '../../shared/components/app-icon/app-icon';
import { AuthService } from '../auth-service';
import { Router } from '@angular/router';
import { Me } from '../../core/models/user.model';
import { AppToast } from '../../shared/components/app-toast/app-toast';
import { ToastService } from '../../core/services/toast-service';

@Component({
  selector: 'app-login',
  imports: [AppInputForm, ReactiveFormsModule, AppButton, AppIcon],
  templateUrl: './login.html',
})
export class Login {
  authService = inject(AuthService);
  router = inject(Router);
  toastService = inject(ToastService);
  errorMessage = signal('');

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
            type:'error',
            message:'Incorrect username or password'})
        },
      });
    }
  } 
}
