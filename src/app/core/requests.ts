import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MoneyRequest {
  id: number;
  amount: string;
  status: 'pending' | 'approved' | 'rejected';
  currency: { id: number; code: string; symbol: string };
  created_at: string;
}

export interface MyRequests {
  deposits: MoneyRequest[];
  withdrawals: MoneyRequest[];
}

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  createDeposit(currencyId: number, amount: number): Observable<MoneyRequest> {
    return this.http.post<MoneyRequest>(`${this.apiUrl}/deposit-requests`, {
      currency_id: currencyId,
      amount,
    });
  }

  createWithdrawal(currencyId: number, amount: number): Observable<MoneyRequest> {
    return this.http.post<MoneyRequest>(`${this.apiUrl}/withdrawal-requests`, {
      currency_id: currencyId,
      amount,
    });
  }

  getMyRequests(): Observable<MyRequests> {
    return this.http.get<MyRequests>(`${this.apiUrl}/my-requests`);
  }
}