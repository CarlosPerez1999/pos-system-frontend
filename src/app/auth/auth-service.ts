import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { authResponse, Me, User } from '../core/models/user.model';
import { tap, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
/**
 * Service to handle user authentication (login, logout, token validation, token refresh).
 */
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.API_URL}/auth`;
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<authResponse | null> = new BehaviorSubject<authResponse | null>(null);

  /**
   * Authenticates a user with username and password.
   * Stores the JWT tokens in local storage upon success.
   * @param data The login credentials.
   * @returns An observable of the auth response.
   */
  login(data: Pick<User, 'username' | 'password'>) {
    return this.http.post<authResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((res) => {
        this.setTokens(res.access_token, res.refresh_token);
      }),
      tap(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
          this.validateToken().subscribe(console.log);
        }
      })
    );
  }

  /**
   * Logs out the user by removing tokens from local storage and calling the backend logout endpoint.
   */
  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.clearTokens();
      })
    );
  }

  /**
   * Validates the current token with the backend.
   * @returns An observable of the current user's details.
   */
  validateToken() {
    return this.http.post<Me>(`${this.apiUrl}/me`, {});
  }

  /**
   * Refreshes the access token using the refresh token.
   * @returns An observable of the new auth response with new tokens.
   */
  refreshToken(): Observable<authResponse> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return this.http.post<authResponse>(`${this.apiUrl}/refresh`, {}, {
      headers: {
        'Authorization': `Bearer ${refreshToken}`
      }
    }).pipe(
      tap((res) => {
        this.setTokens(res.access_token, res.refresh_token);
        this.refreshTokenSubject.next(res);
      })
    );
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

  /**
   * Retrieves the refresh token from local storage.
   * @returns The refresh token string or null if not found.
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  /**
   * Stores both access and refresh tokens in local storage.
   * @param accessToken The JWT access token.
   * @param refreshToken The JWT refresh token.
   */
  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('jwt', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  /**
   * Removes both access and refresh tokens from local storage.
   */
  private clearTokens(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('refresh_token');
  }

  /**
   * Gets the refresh token subject observable for coordinating concurrent refresh requests.
   */
  getRefreshTokenSubject(): BehaviorSubject<authResponse | null> {
    return this.refreshTokenSubject;
  }

  /**
   * Sets the refresh token in progress flag.
   */
  setRefreshTokenInProgress(inProgress: boolean): void {
    this.refreshTokenInProgress = inProgress;
  }

  /**
   * Gets the refresh token in progress flag.
   */
  isRefreshTokenInProgress(): boolean {
    return this.refreshTokenInProgress;
  }
}
