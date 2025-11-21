import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/auth-service';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getAuthToken();
  if (!token) {
    return true;
  }

  return authService.validateToken().pipe(
    map((me) => {
      const role = me.payload.role;

      if (state.url === '/' || state.url === '') {
        return role === 'admin'
          ? router.createUrlTree(['/admin'])
          : router.createUrlTree(['/pos']);
      }

      if (role === 'admin' && state.url.startsWith('/admin')) {
        return true;
      }
      if (role === 'seller' && state.url.startsWith('/pos')) {
        return true;
      }

      return role === 'admin'
        ? router.createUrlTree(['/admin'])
        : router.createUrlTree(['/pos']);
    }),
    catchError(() => of(router.createUrlTree(['/'])))
  );
};
