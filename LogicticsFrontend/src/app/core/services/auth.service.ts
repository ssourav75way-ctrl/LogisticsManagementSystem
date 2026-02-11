import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

import { User } from '../models';

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
        const decoded: any = jwtDecode(token);
        this.currentUser.set({
          ...decoded,
          id: decoded.sub ? parseInt(decoded.sub, 10) : decoded.id,
          role: (decoded.role || decoded.Role)?.toUpperCase(),
          name: decoded.name || decoded.UniqueName || decoded.email,
        });
      } catch (e) {
        this.logout();
      }
    }
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        const token = res.token || res.Token;
        if (token) {
          localStorage.setItem(this.tokenKey, token);
          this.checkToken();
        }
      }),
    );
  }

  register(data: any): Observable<any> {
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
