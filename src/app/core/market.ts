import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, switchMap, shareReplay, startWith, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Asset {
  id: number;
  symbol: string;
  name: string;
  type: string;
  sector: string | null;
  is_active: boolean;
  currency: { id: number; code: string; symbol: string };
  latest_price: { price: string; recorded_at: string } | null;
}

export interface TickResult {
  asset_id: number;
  symbol: string;
  price: number;
  previous_price: number;
  change_percent: number;
}

export interface FictionalUser {
  id: number;
  name: string;
  badge: 'none' | 'vip' | 'certified';
}

@Injectable({
  providedIn: 'root',
})
export class Market {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  ticks$: Observable<TickResult[]> = interval(2000).pipe(
    startWith(0),
    switchMap(() => this.tick().pipe(catchError(() => of([] as TickResult[])))),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  getAssets(): Observable<Asset[]> {
    return this.http.get<Asset[]>(`${this.apiUrl}/assets`);
  }

  getCurrencies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/currencies`);
  }

  getFictionalUsersSample(): Observable<FictionalUser[]> {
    return this.http.get<FictionalUser[]>(`${this.apiUrl}/fictional-users/sample`);
  }

  private tick(): Observable<TickResult[]> {
    return this.http.post<TickResult[]>(`${this.apiUrl}/market/tick`, {});
  }
}