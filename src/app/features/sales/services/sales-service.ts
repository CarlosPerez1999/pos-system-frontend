import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { CartItem } from '../interfaces/cart.interface';
import { catchError, tap } from 'rxjs';
import { Summary } from '../interfaces/summary.interface';
import { Sale } from '../interfaces/sale.interface';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.API_URL}/sales`;
  summary = signal<Summary | null>(null);
  todaySales = signal<Sale[]>([]);

  private isLoading = signal<boolean>(false);
  private hasError = signal<string | null>(null);

  createSale(items: CartItem[]) {
    this.isLoading.set(true);
    this.hasError.set(null);

    const listItems = items.map((i) => ({
      productId: i.product.id,
      quantity: i.quantity,
    }));

    return this.http
      .post(`${this.apiUrl}`, {
        date: new Date(),
        items: listItems,
      })
      .pipe(
        tap(() => this.isLoading.set(false)),
        catchError((error: HttpErrorResponse) => {
          this.hasError.set(error.error.message || 'Error creating product');
          this.isLoading.set(false);
          throw error;
        })
      );
  }

  getSummary() {
    this.http.get<Summary>(`${this.apiUrl}/summary`).subscribe(res => this.summary.set(res));
  }

  getTodaySales() {
    this.http.get<Sale[]>(`${this.apiUrl}/of-the-day`).subscribe(res => this.todaySales.set(res));
  }


}
