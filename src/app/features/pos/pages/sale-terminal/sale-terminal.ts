import { Component } from '@angular/core';
import { ProductsGrid } from '../../../products/components/products-grid/products-grid';
import { ShoppingCart } from '../../../sales/components/shopping-cart/shopping-cart';

@Component({
  selector: 'app-sale-terminal',
  imports: [ProductsGrid, ShoppingCart],
  templateUrl: './sale-terminal.html',
})
export class SaleTerminal {}
