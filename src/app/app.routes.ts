import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'pos',
    loadChildren: () =>
      import('./features/pos/pos.routes').then((m) => m.POS_ROUTES),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
];
