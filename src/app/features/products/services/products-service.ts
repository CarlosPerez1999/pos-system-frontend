import {
  effect,
  inject,
  Injectable,
  linkedSignal,
  signal,
} from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  httpResource,
} from '@angular/common/http';
import {
  Product,
  ProductCreate,
  ProductsResponse,
  ProductUpdate,
} from '../../../core/models/product.model';
import { catchError, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.API_URL}/products`;
  private products = signal<Product[]>([]);
  products$ = this.products.asReadonly();

  private isLoading = signal<boolean>(false);
  private hasError = signal<string | null>(null);

  private limit = signal(10);
  private offset = signal(0);
  private searchQuery = signal('');

  productsResource = httpResource<ProductsResponse | undefined>(() => ({
    url: `${this.apiUrl}`,
    params: {
      offset: this.offset(),
      limit: this.limit(),
      search: this.searchQuery(),
    },
  }));

  productsEffect = effect(() => {
    if (!this.productsResource.hasValue()) return;
    this.products.set(this.productsResource.value().items);
  });

  getProductById(id: string) {
    return httpResource<Product>(() => `${this.apiUrl}/${id}`);
  }

  createProduct(data: ProductCreate) {
    this.isLoading.set(true);
    this.hasError.set(null);
    return this.http.post<Product>(`${this.apiUrl}`, data).pipe(
      tap(() => this.isLoading.set(false)),
      catchError((error: HttpErrorResponse) => {
        this.hasError.set(error.error.message || 'Error creating product');
        this.isLoading.set(false);
        throw error;
      })
    );
  }

  updateProduct(id: string, data: ProductUpdate) {
    this.isLoading.set(true);
    this.hasError.set(null);
    return this.http.patch<Product>(`${this.apiUrl}/${id}`, data).pipe(
      tap(() => this.isLoading.set(false)),
      catchError((error: HttpErrorResponse) => {
        this.hasError.set(error.error.message || 'Error updating product');
        this.isLoading.set(false);
        throw error;
      })
    );
  }
  deleteProduct(id: string) {
    this.isLoading.set(true);
    this.hasError.set(null);
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.isLoading.set(false)),
      catchError((error: HttpErrorResponse) => {
        this.hasError.set(error.error.message || 'Error deleting product');
        this.isLoading.set(false);
        throw error;
      })
    );
  }

  setSearchQuery(newQuery: string) {
    this.searchQuery.set(newQuery);
  }
}
