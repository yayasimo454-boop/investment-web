import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MyRequests, RequestsService } from '../../core/requests';

@Component({
  selector: 'app-finance',
  imports: [DecimalPipe, TranslatePipe],
  templateUrl: './finance.html',
  styleUrl: './finance.css',
})
export class Finance implements OnInit {
  private requestsService = inject(RequestsService);

  requests = signal<MyRequests>({ deposits: [], withdrawals: [] });

  ngOnInit(): void {
    this.requestsService.getMyRequests().subscribe((data) => this.requests.set(data));
  }
}