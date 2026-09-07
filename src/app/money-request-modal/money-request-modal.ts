import { Component, EventEmitter, Output, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RequestsService } from '../core/requests';
import { WalletService } from '../core/wallet';

@Component({
  selector: 'app-money-request-modal',
  imports: [FormsModule],
  templateUrl: './money-request-modal.html',
  styleUrl: './money-request-modal.css',
})
export class MoneyRequestModal {
  private requestsService = inject(RequestsService);
  private walletService = inject(WalletService);

  mode = input.required<'deposit' | 'withdrawal'>();

  @Output() close = new EventEmitter<void>();

  amount = 0;
  feedback = signal<string>('');
  loading = signal<boolean>(false);

  wallets = this.walletService.wallets;
  selectedCurrencyId = 0;

  ngOnInit(): void {
    this.walletService.fetchMyWallets().subscribe((wallets) => {
      if (wallets.length > 0) {
        this.selectedCurrencyId = wallets[0].currency.id;
      }
    });
  }

  submit(): void {
    if (this.amount <= 0 || !this.selectedCurrencyId) {
      this.feedback.set('Montant ou devise invalide.');
      return;
    }

    this.loading.set(true);
    this.feedback.set('');

    const request$ =
      this.mode() === 'deposit'
        ? this.requestsService.createDeposit(this.selectedCurrencyId, this.amount)
        : this.requestsService.createWithdrawal(this.selectedCurrencyId, this.amount);

    request$.subscribe({
      next: () => {
        this.loading.set(false);
        this.feedback.set(
          this.mode() === 'deposit'
            ? 'Demande de dépôt envoyée, en attente de validation.'
            : 'Demande de retrait envoyée, en attente de validation.'
        );
        this.amount = 0;
      },
      error: (err) => {
        this.loading.set(false);
        this.feedback.set(err.error?.message ?? 'Une erreur est survenue.');
      },
    });
  }
}