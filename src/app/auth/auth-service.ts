import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { authResponse, Me, User } from '../core/models/user.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.API_URL}/auth`;
  
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

  logout(){
    localStorage.removeItem
  }

  validateToken() {
    return this.http.post<Me>(`${this.apiUrl}/me`,{});
  }

    getAuthToken(): string | null {
    return localStorage.getItem('jwt');
  }
}
