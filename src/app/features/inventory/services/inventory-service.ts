import { effect, inject, Injectable, signal } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  httpResource,
} from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import {
  InventoryMovement,
  InventoryMovementCreate,
  InventoryMovementResponse,
} from '../../../core/models/inventory.model';
import { catchError, Observable, tap } from 'rxjs';
import { Product, ProductsResponse } from '../../../core/models/product.model';

@Injectable({
  providedIn: 'root',
})
/**
 * Service for managing inventory movements and low stock products.
 * Handles fetching, creating, and deleting inventory records.
 */
export class InventoryService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.API_URL}/inventory`;

  private movements = signal<InventoryMovement[]>([]);
  movements$ = this.movements.asReadonly();

  isLoading = signal<boolean>(false);
  private hasError = signal<string | null>(null);
  private limit = signal(10);
  private offset = signal(0);
  private productId = signal<string | null>(null);
  totalMovements = signal(0);

  private lowStockProducts = signal<Product[]>([]);
  lowStockProducts$ = this.lowStockProducts.asReadonly();

  private lowStockOffset = signal(0);
  private lowStockLimit = signal(10);
  totalLowStock = signal(0);
  private isLoadingLowStock = signal(false);

  /**
   * Resource for fetching inventory movements with pagination and filtering.
   * Reloads when offset, limit, or productId changes.
   */
  movementsResource = httpResource<InventoryMovementResponse | undefined>(
    () => ({
      url: this.apiUrl,
      params: {
        offset: this.offset(),
        limit: this.limit(),
        productId: this.productId() ?? '',
      },
    })
  );

  /**
   * Resource for fetching low stock products.
   * Reloads when offset or limit changes.
   */
  lowStockResource = httpResource<ProductsResponse | undefined>(() => ({
    url: `${this.apiUrl}/low-stock`,
    params: {
      offset: this.lowStockOffset(),
      limit: this.lowStockLimit(),
    },
  }));

  lowStockEffect = effect(() => {
    const res = this.lowStockResource.value();
    if (!res) return;

    this.totalLowStock.set(res.total);

    if (this.lowStockOffset() === 0) {
      this.lowStockProducts.set(res.items);
    } else {
      this.lowStockProducts.update((prev) => [...prev, ...res.items]);
    }

    this.isLoadingLowStock.set(false);
  });

  movementsEffect = effect(() => {
    const res = this.movementsResource.value();
    if (!res) return;
    this.totalMovements.set(res.total);

    if (this.offset() === 0) {
      this.movements.set(res.items);
    } else {
      this.movements.update((prev) => [...prev, ...res.items]);
    }
    this.isLoading.set(false);
  });

  /**
   * Creates a new inventory movement (e.g., stock in/out).
   * Reloads movements and low stock resources on success.
   * @param data The movement data.
   */
  createMovement(data: InventoryMovementCreate) {
    this.isLoading.set(true);
    this.hasError.set(null);
    return this.http.post<InventoryMovement>(this.apiUrl, data).pipe(
      tap(() => this.isLoading.set(false)),
      tap(() => this.movementsResource.reload()),
      tap(() => this.lowStockResource.reload()),
      catchError((error: HttpErrorResponse) => {
        this.hasError.set(error.error.message || 'Error creating movement');
        this.isLoading.set(false);
        throw error;
      })
    );
  }

  deleteMovement(id: string) {
    this.isLoading.set(true);
    this.hasError.set(null);
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.isLoading.set(false)),
      tap(() => this.movementsResource.reload()),
      tap(() => this.lowStockResource.reload()),
      catchError((error: HttpErrorResponse) => {
        this.hasError.set(error.error.message || 'Error deleting movement');
        this.isLoading.set(false);
        throw error;
      })
    );
  }

  nextPage() {
    if (this.isLoading() || !this.hasMore()) return;
    this.isLoading.set(true);
    this.offset.update((off) => off + this.limit());
  }

  hasMore() {
    return this.movements().length < this.totalMovements();
  }

  /**
   * Sets the product ID filter for movements.
   * Resets pagination and reloads the resource.
   * @param id The product ID.
   */
  setProductId(id: string) {
    this.movements.set([]);
    this.totalMovements.set(0);
    this.hasError.set(null);
    this.isLoading.set(true);

    this.productId.set(id);
    this.offset.set(0);
    this.movementsResource.reload();
  }

  hasMoreLowStock() {
    return this.lowStockProducts().length < this.totalLowStock();
  }

  nextPageLowStock() {
    if (this.isLoadingLowStock() || !this.hasMoreLowStock()) return;
    this.isLoadingLowStock.set(true);
    this.lowStockOffset.update((off) => off + this.lowStockLimit());
  }

  resetLowStock() {
    this.lowStockProducts.set([]);
    this.totalLowStock.set(0);
    this.lowStockOffset.set(0);
    this.isLoadingLowStock.set(true);
    this.lowStockResource.reload();
  }
}
