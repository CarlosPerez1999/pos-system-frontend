import { Routes } from '@angular/router';
import PosLayout from './layouts/layout';
import { SaleTerminal } from './pages/sale-terminal/sale-terminal';

/**
 * Routes configuration for the POS (Point of Sale) feature.
 * Defines the layout and sale terminal page.
 */
export const POS_ROUTES: Routes = [
  {
    path: '',
    component: PosLayout,
    children: [
      {
        path: '',
        component: SaleTerminal,
      },
    ],
  },
];
