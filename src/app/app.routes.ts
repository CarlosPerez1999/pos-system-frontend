import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'pos',
    loadChildren:() => import('./features/pos/pos.routes').then(m => m.POS_ROUTES) 
  }
];
