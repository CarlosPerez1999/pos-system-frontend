import { inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { AuthService } from '../../auth/auth-service';
import { catchError, switchMap, throwError, filter, take } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Interceptor to handle 401 Unauthorized errors and automatically refresh the access token.
 * If the access token is expired, it attempts to use the refresh token to get a new access token.
 * If the refresh token is also invalid, it redirects to the login page.
 */
export function tokenRefreshInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Only handle 401 errors and avoid infinite loops on auth endpoints
      if (
        error.status === 401 &&
        !req.url.includes('/auth/login') &&
        !req.url.includes('/auth/refresh')
      ) {
        // Check if refresh is already in progress
        if (authService.isRefreshTokenInProgress()) {
          // Wait for the refresh to complete and retry the request
          return authService.getRefreshTokenSubject().pipe(
            filter((result) => result !== null),
            take(1),
            switchMap((tokens) => {
              // Clone the request with the new access token
              const clonedReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${tokens!.access_token}`,
                },
              });
              return next(clonedReq);
            })
          );
        } else {
          // Start the refresh process
          authService.setRefreshTokenInProgress(true);
          authService.getRefreshTokenSubject().next(null);

          return authService.refreshToken().pipe(
            switchMap((tokens) => {
              authService.setRefreshTokenInProgress(false);
              
              // Clone the request with the new access token
              const clonedReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${tokens.access_token}`,
                },
              });
              return next(clonedReq);
            }),
            catchError((refreshError) => {
              // Refresh token failed, logout and redirect to login
              authService.setRefreshTokenInProgress(false);
              authService.getRefreshTokenSubject().next(null);
              
              // Clear tokens
              localStorage.removeItem('jwt');
              localStorage.removeItem('refresh_token');
              
              // Redirect to login
              router.navigate(['/auth/login']);
              
              return throwError(() => refreshError);
            })
          );
        }
      }

      return throwError(() => error);
    })
  );
}
