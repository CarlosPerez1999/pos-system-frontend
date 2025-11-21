import { Routes } from '@angular/router';
import { AdminLayout } from './layouts/layout';
import { ProductsPage } from './pages/products/products';
import { InventoryPage } from './pages/inventory/inventory';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      {
        path: 'products',
        component: ProductsPage,
      },
      {
        path: 'inventory',
        component: InventoryPage,
      },
      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  },
];
