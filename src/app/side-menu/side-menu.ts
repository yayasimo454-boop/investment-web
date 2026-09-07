import { Component, EventEmitter, Output, computed, effect, inject, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Auth } from '../core/auth';
import { WalletService } from '../core/wallet';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
  enabled: boolean;
}

@Component({
  selector: 'app-side-menu',
  imports: [DecimalPipe, TranslatePipe],
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.css',
})
export class SideMenu {
  private auth = inject(Auth);
  private router = inject(Router);
  private walletService = inject(WalletService);

  isOpen = input.required<boolean>();
  activeRoute = input<string>('dashboard');

  @Output() close = new EventEmitter<void>();
  @Output() deposit = new EventEmitter<void>();
  @Output() withdraw = new EventEmitter<void>();

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.walletService.fetchMyWallets().subscribe();
      }
    });
  }

  wallets = this.walletService.wallets;

  private baseNavItems: NavItem[] = [
    { label: 'NAV.TRADING', icon: '📈', route: 'trading', enabled: true },
    { label: 'NAV.FINANCE', icon: '💼', route: 'finance', enabled: true },
    { label: 'NAV.PROFILE', icon: '👤', route: 'profil', enabled: true },
    { label: 'NAV.MARKET', icon: '🛒', route: 'dashboard', enabled: true },
    { label: 'NAV.ACHIEVEMENTS', icon: '🏆', route: 'realisations', enabled: true },
    { label: 'NAV.TOURNAMENTS', icon: '🎯', route: 'tournois', enabled: true },
    { label: 'NAV.CHAT', icon: '💬', route: 'chat', enabled: true },
    { label: 'NAV.SUPPORT', icon: '❓', route: 'assistance', enabled: true },
  ];

  isAdmin = computed(() => this.auth.currentUser()?.role === 'admin');

  navItems = computed<NavItem[]>(() => {
    if (!this.isAdmin()) return this.baseNavItems;
    return [
      ...this.baseNavItems,
      { label: 'NAV.ADMIN', icon: '🛠', route: 'admin', enabled: true },
    ];
  });

  userName = computed(() => this.auth.currentUser()?.name ?? 'Invité');
  userInitial = computed(() => this.userName().charAt(0).toUpperCase());
  userId = computed(() => this.auth.currentUser()?.id ?? '—');
  userEmail = computed(() => this.auth.currentUser()?.email ?? '—');

  kycKey = computed(() => {
    const status = this.auth.currentUser()?.kyc_status;
    switch (status) {
      case 'verified':
        return 'MENU.VERIFIED';
      case 'pending':
        return 'MENU.PENDING';
      case 'rejected':
        return 'MENU.REJECTED';
      default:
        return 'MENU.NOT_VERIFIED';
    }
  });

  roleKey = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return 'MENU.BEGINNER';
    return user.role === 'admin' ? 'MENU.ADMINISTRATOR' : 'MENU.BEGINNER';
  });

  onNavigate(item: NavItem): void {
    if (!item.enabled) return;
    this.router.navigate(['/' + item.route]);
    this.close.emit();
  }

  onDeposit(): void {
    this.deposit.emit();
  }

  onWithdraw(): void {
    this.withdraw.emit();
  }

  onLogout(): void {
    this.close.emit();
    this.auth.logout();
  }
}