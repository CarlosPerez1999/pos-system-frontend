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
   * Requests a password reset for the given email.
   * @param email The user's email address.
   * @returns An observable of the password reset response.
   */
  requestPasswordReset(email: string) {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  /**
   * Changes the password for an authenticated user.
   * Requires the user's old password for verification and the new password.
   * This endpoint is protected and requires JWT authentication.
   * @param data Object containing oldPassword and newPassword.
   * @returns Observable that emits a success message on password change.
   */
  changePassword(data: { oldPassword: string; newPassword: string }) {
    return this.http.post(`${this.apiUrl}/change-password`, data);
  }

  /**
   * Resets the password using a token from the password reset email.
   * The token is generated during the forgot-password flow and has a 15-minute expiration.
   * @param data Object containing the reset token and new password.
   * @returns Observable that emits a success message on password reset.
   */
  resetPassword(data: { token: string; newPassword: string }) {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }

  /**
   * Retrieves the current authentication token from local storage.
   * @returns The token string or null if not found.
   */
  getAuthToken(): string | null {
    return localStorage.getItem('jwt');
  }
}
