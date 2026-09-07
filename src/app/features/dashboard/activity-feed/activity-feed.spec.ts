import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Market, FictionalUser } from '../../../core/market';

interface ActivityItem {
  id: number;
  userName: string;
  badge: 'none' | 'vip' | 'certified';
  action: 'buy' | 'sell';
  symbol: string;
  amount: number;
  timestamp: Date;
}

@Component({
  selector: 'app-activity-feed',
  imports: [DecimalPipe, TranslatePipe],
  templateUrl: './activity-feed.html',
  styleUrl: './activity-feed.css',
})
export class ActivityFeed implements OnInit, OnDestroy {
  private market = inject(Market);
  private tickSubscription?: Subscription;
  private nextId = 0;

  private fictionalUsers: FictionalUser[] = [];

  items = signal<ActivityItem[]>([]);
  private readonly maxItems = 8;

  ngOnInit(): void {
    this.market.getFictionalUsersSample().subscribe((users) => {
      this.fictionalUsers = users;
    });

    this.tickSubscription = this.market.ticks$.subscribe((results) => {
      if (!results.length || this.fictionalUsers.length === 0) return;

      if (Math.random() > 0.45) return;

      const asset = results[Math.floor(Math.random() * results.length)];
      const user = this.fictionalUsers[Math.floor(Math.random() * this.fictionalUsers.length)];
      const action: 'buy' | 'sell' = Math.random() > 0.5 ? 'buy' : 'sell';
      const amount = +(Math.random() * 5 + 0.1).toFixed(3);

      const newItem: ActivityItem = {
        id: this.nextId++,
        userName: user.name,
        badge: user.badge,
        action,
        symbol: asset.symbol,
        amount,
        timestamp: new Date(),
      };

      this.items.update((current) => {
        const updated = [newItem, ...current];
        return updated.length > this.maxItems ? updated.slice(0, this.maxItems) : updated;
      });
    });
  }

  ngOnDestroy(): void {
    this.tickSubscription?.unsubscribe();
  }
}