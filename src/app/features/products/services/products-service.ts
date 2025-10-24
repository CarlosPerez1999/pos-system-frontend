import { effect, inject, Injectable, signal } from '@angular/core';
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

  isLoading = signal<boolean>(false);
  private hasError = signal<string | null>(null);
  private limit = signal(10);
  private offset = signal(0);
  private searchQuery = signal('');
  totalProducts = signal(0);

  productsResource = httpResource<ProductsResponse | undefined>(() => ({
    url: `${this.apiUrl}`,
    params: {
      offset: this.offset(),
      limit: this.limit(),
      search: this.searchQuery(),
    },
  }));

  productsEffect = effect(() => {
    const res = this.productsResource.value();
    if (!res) return;
    this.totalProducts.set(res.total);

    if (this.offset() === 0) {
      this.products.set(res.items);
    } else {
      this.products.update((prev) => [...prev, ...res.items]);
    }
    this.isLoading.set(false);
  });

  getProductById(id: string) {
    return httpResource<Product>(() => `${this.apiUrl}/${id}`);
  }

  createProduct(data: ProductCreate) {
    this.isLoading.set(true);
    this.hasError.set(null);
    return this.http.post<Product>(`${this.apiUrl}`, data).pipe(
      tap(() => this.isLoading.set(false)),
      tap(() => this.productsResource.reload()),
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
      tap(() => this.productsResource.reload()),
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
      tap(() => this.productsResource.reload()),
      catchError((error: HttpErrorResponse) => {
        this.hasError.set(error.error.message || 'Error deleting product');
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
    return this.products().length < this.totalProducts();
  }

  setSearchQuery(newQuery: string) {
    this.products.set([]);
    this.totalProducts.set(0);
    this.hasError.set(null);
    this.isLoading.set(true);

    this.searchQuery.set(newQuery);
    this.offset.set(0);
    this.productsResource.reload();
  }
}
