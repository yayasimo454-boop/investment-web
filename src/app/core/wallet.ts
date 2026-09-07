import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Wallet {
  id: number;
  balance: string;
  currency: { id: number; code: string; symbol: string };
}

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  wallets = signal<Wallet[]>([]);

  fetchMyWallets(): Observable<Wallet[]> {
    return this.http
      .get<Wallet[]>(`${this.apiUrl}/wallets`)
      .pipe(tap((wallets) => this.wallets.set(wallets)));
  }
}