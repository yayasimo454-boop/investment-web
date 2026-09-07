import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { RequestsService, MyRequests } from '../../core/requests';
import { WalletService } from '../../core/wallet';

@Component({
  selector: 'app-realisations',
  imports: [DecimalPipe, TranslatePipe],
  templateUrl: './realisations.html',
  styleUrl: './realisations.css',
})
export class Realisations implements OnInit {
  private requestsService = inject(RequestsService);
  private walletService = inject(WalletService);

  wallets = this.walletService.wallets;
  myRequests = signal<MyRequests>({ deposits: [], withdrawals: [] });

  totalDeposited = computed(() =>
    this.myRequests()
      .deposits.filter((d) => d.status === 'approved')
      .reduce((sum, d) => sum + +d.amount, 0)
  );

  totalWithdrawn = computed(() =>
    this.myRequests()
      .withdrawals.filter((w) => w.status === 'approved')
      .reduce((sum, w) => sum + +w.amount, 0)
  );

  approvedDepositsCount = computed(
    () => this.myRequests().deposits.filter((d) => d.status === 'approved').length
  );

  approvedWithdrawalsCount = computed(
    () => this.myRequests().withdrawals.filter((w) => w.status === 'approved').length
  );

  currentBalance = computed(() =>
    this.wallets().reduce((sum, w) => sum + +w.balance, 0)
  );

  ngOnInit(): void {
    this.walletService.fetchMyWallets().subscribe();
    this.requestsService.getMyRequests().subscribe((data) => this.myRequests.set(data));
  }
}