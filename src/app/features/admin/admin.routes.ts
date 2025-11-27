import { Routes } from '@angular/router';
import { AdminLayout } from './layouts/layout';
import { ProductsPage } from './pages/products/products';
import { InventoryPage } from './pages/inventory/inventory';
import { DashboardPage } from './pages/dashboard/dashboard';
import { UsersPage } from './pages/users/users';
import { ConfigurationPage } from './pages/configuration/configuration';

/**
 * Routes configuration for the Admin feature.
 * Defines the layout and child routes for dashboard, products, inventory, and users.
 */
export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardPage,
      },
      {
        path: 'products',
        component: ProductsPage,
      },
      {
        path: 'inventory',
        component: InventoryPage,
      },
      {
        path: 'users',
        component: UsersPage,
      },
      {
        path: 'configuration',
        component: ConfigurationPage,
      },
      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  },
];
