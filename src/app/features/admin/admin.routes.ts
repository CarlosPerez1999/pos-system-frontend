import { Routes } from '@angular/router';
import { DashboardPage } from './pages/dashboard/dashboard';
import { AdminLayout } from './layouts/layout';
import { ProductsPage } from './pages/products/products';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      {
        path: 'dashboard',
        component: DashboardPage,
      },
      {
        path: 'products',
        component: ProductsPage,
      },
      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  },
];
