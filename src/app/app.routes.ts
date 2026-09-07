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

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard },
  { path: 'admin', component: AdminDashboard, canActivate: [adminGuard] },
  { path: 'profil', component: Profil },
  { path: 'finance', component: Finance },
  { path: 'trading', component: Trading },
  { path: 'realisations', component: Realisations },
  { path: 'tournois', component: Tournois },
  { path: 'chat', component: Chat },
  { path: 'assistance', component: Assistance },
];