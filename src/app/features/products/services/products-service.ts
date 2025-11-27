import { effect, inject, Injectable, signal, computed } from '@angular/core';
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
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
/**
 * Service for managing product data.
 * Handles CRUD operations, pagination, and search for products.
 */
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.API_URL}/products`;
  private products = signal<Product[]>([]);
  products$ = this.products.asReadonly();
  availableProducts = computed(() =>
    this.products().filter((p) => p.stock > 0)
  );
  private selectedProductId = signal<string | null>(null);

  isLoading = signal<boolean>(false);
  private hasError = signal<string | null>(null);
  private limit = signal(10);
  private offset = signal(0);
  private searchQuery = signal('');
  totalProducts = signal(0);

  /**
   * Resource for fetching products with pagination and search.
   * Automatically reloads when params change.
   */
  productsResource = httpResource<ProductsResponse | undefined>(() => {
    const params: Record<string, string | number | boolean> = {
      offset: this.offset(),
      limit: this.limit(),
    };
    if (this.searchQuery()) {
      params['search'] = this.searchQuery();
    }
    return {
      url: `${this.apiUrl}`,
      params,
    };
  });

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

  productResource = httpResource<Product | undefined>(() => {
    const id = this.selectedProductId();
    return id ? `${this.apiUrl}/${id}` : undefined;
  });

  setSelectedProductId(id: string) {
    this.selectedProductId.set(id);
  }

  /**
   * Creates a new product.
   * Reloads the product list on success.
   * @param data The product data to create.
   */
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

  /**
   * Updates an existing product.
   * Reloads the product list on success.
   * @param id The ID of the product to update.
   * @param data The updated product data.
   */
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

  /**
   * Deletes a product by ID.
   * Reloads the product list on success.
   * @param id The ID of the product to delete.
   */
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

  /**
   * Updates the search query and resets pagination.
   * @param newQuery The new search term.
   */
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
