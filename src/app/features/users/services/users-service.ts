import { effect, inject, Injectable, signal, computed } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  httpResource,
} from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
  User,
  UserResponse,
  UserCreate,
  UserUpdate,
} from '../../../core/models/user.model';
import { catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
/**
 * Service for managing user data.
 * Handles CRUD operations and state management for users.
 */
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.API_URL}/users`;
  private users = signal<User[]>([]);
  users$ = this.users.asReadonly();
  private selectedUserId = signal<string | null>(null);

  isLoading = signal<boolean>(false);
  private hasError = signal<string | null>(null);
  private limit = signal(10);
  private offset = signal(0);
  private searchQuery = signal('');
  totalUsers = signal(0);

  /**
   * Resource for fetching users with pagination and search.
   * Automatically reloads when params change.
   */
  usersResource = httpResource<UserResponse | undefined>(() => ({
    url: `${this.apiUrl}`,
    params: {
      offset: this.offset(),
      limit: this.limit(),
      search: this.searchQuery(),
    },
  }));

  usersEffect = effect(() => {
    const res = this.usersResource.value();
    if (!res) return;
    this.totalUsers.set(res.total);

    if (this.offset() === 0) {
      this.users.set(res.items);
    } else {
      this.users.update((prev) => [...prev, ...res.items]);
    }
    this.isLoading.set(false);
  });

  userResource = httpResource<User | undefined>(() => {
    const id = this.selectedUserId();
    return id ? `${this.apiUrl}/${id}` : undefined;
  });

  setSelectedUserId(id: string) {
    this.selectedUserId.set(id);
  }

  /**
   * Creates a new user.
   * Reloads the user list on success.
   * @param data The user data to create.
   */
  createUser(data: UserCreate) {
    this.isLoading.set(true);
    this.hasError.set(null);
    return this.http.post<User>(`${this.apiUrl}`, data).pipe(
      tap(() => this.isLoading.set(false)),
      tap(() => this.usersResource.reload()),
      catchError((error: HttpErrorResponse) => {
        this.hasError.set(error.error.message || 'Error creating user');
        this.isLoading.set(false);
        throw error;
      })
    );
  }

  /**
   * Updates an existing user.
   * Reloads the user list on success.
   * @param id The ID of the user to update.
   * @param data The updated user data.
   */
  updateUser(id: string, data: UserUpdate) {
    this.isLoading.set(true);
    this.hasError.set(null);
    return this.http.patch<User>(`${this.apiUrl}/${id}`, data).pipe(
      tap(() => this.isLoading.set(false)),
      tap(() => this.usersResource.reload()),
      catchError((error: HttpErrorResponse) => {
        this.hasError.set(error.error.message || 'Error updating user');
        this.isLoading.set(false);
        throw error;
      })
    );
  }

  /**
   * Deletes a user by ID.
   * Reloads the user list on success.
   * @param id The ID of the user to delete.
   */
  deleteUser(id: string) {
    this.isLoading.set(true);
    this.hasError.set(null);
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.isLoading.set(false)),
      tap(() => this.usersResource.reload()),
      catchError((error: HttpErrorResponse) => {
        this.hasError.set(error.error.message || 'Error deleting user');
        this.isLoading.set(false);
        throw error;
      })
    );
  }

  /**
   * Loads the next page of users.
   */
  nextPage() {
    if (this.isLoading() || !this.hasMore()) return;

    this.isLoading.set(true);
    this.offset.update((off) => off + this.limit());
  }

  hasMore() {
    return this.users().length < this.totalUsers();
  }

  /**
   * Updates the search query and resets pagination.
   * @param newQuery The new search term.
   */
  setSearchQuery(newQuery: string) {
    this.users.set([]);
    this.totalUsers.set(0);
    this.hasError.set(null);
    this.isLoading.set(true);

    this.searchQuery.set(newQuery);
    this.offset.set(0);
    this.usersResource.reload();
  }
}
