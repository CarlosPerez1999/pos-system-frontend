import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { authResponse, Me, User } from '../core/models/user.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
/**
 * Service to handle user authentication (login, logout, token validation).
 */
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.API_URL}/auth`;

  /**
   * Authenticates a user with username and password.
   * Stores the JWT token in local storage upon success.
   * @param data The login credentials.
   * @returns An observable of the auth response.
   */
  login(data: Pick<User, 'username' | 'password'>) {
    return this.http.post<authResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((res) => localStorage.setItem('jwt', res.access_token)),
      tap(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
          this.validateToken().subscribe(console.log);
        }
      })
    );
  }

  /**
   * Logs out the user by removing the JWT token from local storage.
   */
  logout() {
    localStorage.removeItem('jwt');
  }

  /**
   * Validates the current token with the backend.
   * @returns An observable of the current user's details.
   */
  validateToken() {
    return this.http.post<Me>(`${this.apiUrl}/me`, {});
  }

  /**
   * Retrieves the current authentication token from local storage.
   * @returns The token string or null if not found.
   */
  getAuthToken(): string | null {
    return localStorage.getItem('jwt');
  }
}
