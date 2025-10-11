import { Routes } from '@angular/router';
import PosLayout from './layouts/pos-layout/pos-layout';
import { SaleTerminal } from './pages/sale-terminal/sale-terminal';

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
]
