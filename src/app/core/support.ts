import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SupportMessage {
  id: number;
  message: string;
  sender: 'user' | 'admin';
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupportService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getMessages(): Observable<SupportMessage[]> {
    return this.http.get<SupportMessage[]>(`${this.apiUrl}/support-messages`);
  }

  sendMessage(message: string): Observable<SupportMessage> {
    return this.http.post<SupportMessage>(`${this.apiUrl}/support-messages`, { message });
  }
}