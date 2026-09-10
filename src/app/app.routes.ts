import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Dashboard } from './features/dashboard/dashboard';
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';
import { Profil } from './features/profil/profil';
import { Finance } from './features/finance/finance';
import { Trading } from './features/trading/trading';
import { Realisations } from './features/realisations/realisations';
import { Tournois } from './features/tournois/tournois';
import { Chat } from './features/chat/chat';
import { Assistance } from './features/assistance/assistance';
import { adminGuard } from './core/admin-guard';
import { authGuard } from './core/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'admin', component: AdminDashboard, canActivate: [authGuard, adminGuard] },
  { path: 'profil', component: Profil, canActivate: [authGuard] },
  { path: 'finance', component: Finance, canActivate: [authGuard] },
  { path: 'trading', component: Trading, canActivate: [authGuard] },
  { path: 'realisations', component: Realisations, canActivate: [authGuard] },
  { path: 'tournois', component: Tournois, canActivate: [authGuard] },
  { path: 'chat', component: Chat, canActivate: [authGuard] },
  { path: 'assistance', component: Assistance, canActivate: [authGuard] },
];