import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { User, LoginResponse } from '../models/auth.model';
import { API_ENDPOINTS } from '../constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  
  // Usar Signal para manejar el estado del usuario actual
  readonly currentUser = signal<User | null>(this.getStoredUser());

  private getStoredUser(): User | null {
    const userJson = localStorage.getItem('auth_user');
    if (!userJson) return null;
    try {
      return JSON.parse(userJson) as User;
    } catch {
      localStorage.removeItem('auth_user');
      return null;
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      username,
      password,
    }).pipe(
      tap((response) => {
        if (response?.user) {
          localStorage.setItem('auth_user', JSON.stringify(response.user));
          this.currentUser.set(response.user);
        }
      })
    );
  }

  loginAsGuestLocal(): void {
    const guestUser: User = {
      username: 'invitado',
      role: 'guest',
      token: `mock-jwt-token-guest-${Date.now()}`,
    };
    localStorage.setItem('auth_user', JSON.stringify(guestUser));
    this.currentUser.set(guestUser);
  }

  logout(): void {
    localStorage.removeItem('auth_user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  getRole(): 'admin' | 'guest' | null {
    const user = this.currentUser();
    return user ? user.role : null;
  }
}
