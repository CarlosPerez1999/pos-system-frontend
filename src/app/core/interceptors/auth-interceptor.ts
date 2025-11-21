import { inject } from '@angular/core';
import { AuthService } from '../../auth/auth-service';
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const authToken = inject(AuthService).getAuthToken();

  if (authToken) {
    const newReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`),
    });
    return next(newReq);
  }

  return next(req);
}
