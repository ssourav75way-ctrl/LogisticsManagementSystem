import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

import { User, LoginRequest, LoginResponse, RegisterRequest, DecodedToken } from '../models';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Auth`;

  private tokenKey = 'authToken';

  currentUser = signal<User | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.checkToken();
  }

  checkToken() {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem(this.tokenKey) : null;
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        this.currentUser.set({
          ...decoded,
          id: decoded.sub ? parseInt(decoded.sub, 10) : (decoded.id ?? 0),
          role: (decoded.role || decoded.Role || 'user').toUpperCase(),
          name: decoded.name || decoded.UniqueName || decoded.email || 'User',
        } as User);
      } catch (e) {
        this.logout();
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: LoginResponse) => {
        const token = res.token || res.Token;
        if (token) {
          localStorage.setItem(this.tokenKey, token);
          this.checkToken();
        }
      }),
    );
  }

  register(data: RegisterRequest): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(this.tokenKey) : null;
  }

  isAdmin(): boolean {
    const user = this.currentUser();
    const role = (user?.role || user?.role || '').toUpperCase();
    return role === 'ADMIN' || role === 'DISPATCHER';
  }
}
