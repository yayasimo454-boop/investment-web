import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  role: 'user' | 'admin';
  is_fictional: boolean;
  kyc_status: string;
  preferred_language: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly apiUrl = environment.apiUrl;

  currentUser = signal<User | null>(null);

  constructor() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  register(
    name: string,
    phone: string,
    password: string,
    passwordConfirmation: string,
    email?: string
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, {
        name,
        phone,
        email: email || null,
        password,
        password_confirmation: passwordConfirmation,
      })
      .pipe(tap((response) => this.handleAuthSuccess(response)));
  }

  login(phone: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, { phone, password })
      .pipe(tap((response) => this.handleAuthSuccess(response)));
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      complete: () => this.handleLogout(),
      error: () => this.handleLogout(),
    });
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUser.set(response.user);
  }

  private handleLogout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}