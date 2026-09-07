import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Admin, AdminUser, PendingRequests } from '../../../core/admin';

type Tab = 'users' | 'requests';

@Component({
  selector: 'app-admin-dashboard',
  imports: [DecimalPipe, FormsModule, TranslatePipe],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  private admin = inject(Admin);

  activeTab = signal<Tab>('users');

  users = signal<AdminUser[]>([]);
  requests = signal<PendingRequests>({ deposits: [], withdrawals: [], orders: [] });

  editingBalanceFor = signal<number | null>(null);
  newBalance = 0;
  selectedCurrencyId = 0;

  editingUserFor = signal<number | null>(null);
  editForm: {
    name: string;
    email: string;
    role: 'user' | 'admin';
    badge: 'none' | 'vip' | 'certified';
    kyc_status: string;
  } = {
    name: '',
    email: '',
    role: 'user',
    badge: 'none',
    kyc_status: 'pending',
  };

  ngOnInit(): void {
    this.loadUsers();
    this.loadRequests();
  }

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
  }

  loadUsers(): void {
    this.admin.getUsers().subscribe((users) => this.users.set(users));
  }

  loadRequests(): void {
    this.admin.getPendingRequests().subscribe((requests) => this.requests.set(requests));
  }

  deleteUser(user: AdminUser): void {
    if (!confirm(`Supprimer définitivement ${user.name} ?`)) return;

    this.admin.deleteUser(user.id).subscribe(() => this.loadUsers());
  }

  startEditBalance(userId: number, currencyId: number, currentBalance: string): void {
    this.editingBalanceFor.set(userId);
    this.selectedCurrencyId = currencyId;
    this.newBalance = +currentBalance;
  }

  cancelEditBalance(): void {
    this.editingBalanceFor.set(null);
  }

  saveBalance(userId: number): void {
    this.admin.updateWalletBalance(userId, this.selectedCurrencyId, this.newBalance).subscribe(() => {
      this.editingBalanceFor.set(null);
      this.loadUsers();
    });
  }

  startEditUser(user: AdminUser): void {
    this.editingUserFor.set(user.id);
    this.editForm = {
      name: user.name,
      email: user.email,
      role: user.role,
      badge: user.badge,
      kyc_status: user.kyc_status,
    };
  }

  cancelEditUser(): void {
    this.editingUserFor.set(null);
  }

  saveUser(userId: number): void {
    this.admin.updateUser(userId, this.editForm).subscribe(() => {
      this.editingUserFor.set(null);
      this.loadUsers();
    });
  }

  toggleBlock(user: AdminUser): void {
    const action = user.is_blocked ? 'débloquer' : 'bloquer';
    if (!confirm(`Voulez-vous vraiment ${action} ${user.name} ?`)) return;

    this.admin.updateUser(user.id, { is_blocked: !user.is_blocked }).subscribe(() => this.loadUsers());
  }

  approveDeposit(id: number): void {
    this.admin.approveDeposit(id).subscribe(() => this.loadRequests());
  }

  rejectDeposit(id: number): void {
    this.admin.rejectDeposit(id).subscribe(() => this.loadRequests());
  }

  approveWithdrawal(id: number): void {
    this.admin.approveWithdrawal(id).subscribe(() => this.loadRequests());
  }

  rejectWithdrawal(id: number): void {
    this.admin.rejectWithdrawal(id).subscribe(() => this.loadRequests());
  }

  approveOrder(id: number): void {
    this.admin.approveOrder(id).subscribe(() => this.loadRequests());
  }

  rejectOrder(id: number): void {
    this.admin.rejectOrder(id).subscribe(() => this.loadRequests());
  }
}