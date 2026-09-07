import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  is_fictional: boolean;
  badge: 'none' | 'vip' | 'certified';
  kyc_status: string;
  is_blocked: boolean;
  wallets: { id: number; balance: string; currency: { id: number; code: string; symbol: string } }[];
}

export interface PendingRequests {
  deposits: any[];
  withdrawals: any[];
  orders: any[];
}

@Injectable({
  providedIn: 'root',
})
export class Admin {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/admin`;

  getUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.apiUrl}/users`);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`);
  }

  updateUser(userId: number, data: Partial<AdminUser>): Observable<AdminUser> {
    return this.http.put<AdminUser>(`${this.apiUrl}/users/${userId}`, data);
  }

  updateWalletBalance(userId: number, currencyId: number, balance: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}/wallet-balance`, {
      currency_id: currencyId,
      balance,
    });
  }

  getPendingRequests(): Observable<PendingRequests> {
    return this.http.get<PendingRequests>(`${this.apiUrl}/requests`);
  }

  approveDeposit(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/deposit-requests/${id}/approve`, {});
  }

  rejectDeposit(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/deposit-requests/${id}/reject`, {});
  }

  approveWithdrawal(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/withdrawal-requests/${id}/approve`, {});
  }

  rejectWithdrawal(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/withdrawal-requests/${id}/reject`, {});
  }

  approveOrder(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/order-requests/${id}/approve`, {});
  }

  rejectOrder(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/order-requests/${id}/reject`, {});
  }
}