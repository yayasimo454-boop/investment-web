import { Component, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Auth } from '../../core/auth';
import { UnifiedChart } from './unified-chart/unified-chart';
import { ActivityFeed } from './activity-feed/activity-feed';
import { SideMenu } from '../../side-menu/side-menu';
import { MoneyRequestModal } from '../../money-request-modal/money-request-modal';

@Component({
  selector: 'app-dashboard',
  imports: [UnifiedChart, ActivityFeed, SideMenu, MoneyRequestModal, TranslatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private auth = inject(Auth);
  currentUser = this.auth.currentUser;

  isMenuOpen = signal(false);
  activeModal = signal<'deposit' | 'withdrawal' | null>(null);

  onDeposit(): void {
    this.activeModal.set('deposit');
  }

  onWithdraw(): void {
    this.activeModal.set('withdrawal');
  }

  closeModal(): void {
    this.activeModal.set(null);
  }
}