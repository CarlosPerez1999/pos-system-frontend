import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    canActivate:[authGuard],
    component: Login
  },
  {
    path: 'pos',
    canActivate:[authGuard],
    loadChildren: () =>
      import('./features/pos/pos.routes').then((m) => m.POS_ROUTES),
  },
  {
    path: 'admin',
    canActivate:[authGuard],
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
];
