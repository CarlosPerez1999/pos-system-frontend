import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { InventoryMovement, InventoryMovementCreate } from '../../../core/models/inventory.model';
import { environment } from '../../../../environments/environment.development';
import { catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
   private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.API_URL}/inventory`;
  isLoading = signal<boolean>(false);
  private hasError = signal<string | null>(null);

createInventoryMovement(data: InventoryMovementCreate) {
    this.isLoading.set(true);
    this.hasError.set(null);
    return this.http.post<InventoryMovement>(`${this.apiUrl}`, data).pipe(
      tap(() => this.isLoading.set(false)),
      catchError((error: HttpErrorResponse) => {
        this.hasError.set(error.error.message || 'Error creating inventory movement');
        this.isLoading.set(false);
        throw error;
      })
    );
  }

}
