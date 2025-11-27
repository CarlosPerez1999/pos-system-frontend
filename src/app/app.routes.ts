import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { authGuard } from './core/guards/auth-guard';
import { ResetPasswordPage } from './auth/reset-password/reset-password';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    component: Login,
  },
  {
    path: 'auth/login',
    component: Login,
  },
  {
    path: 'auth/reset-password',
    component: ResetPasswordPage,
  },
  {
    path: 'pos',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/pos/pos.routes').then((m) => m.POS_ROUTES),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
];
