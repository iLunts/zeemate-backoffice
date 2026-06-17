import { Routes } from '@angular/router';
import { authGuard, noAuthGuard } from './core/auth/auth.guard';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  { path: 'login', canActivate: [noAuthGuard], loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent) },
  { path: 'callback', loadComponent: () => import('./features/callback/callback.component').then(m => m.CallbackComponent) },
  { path: 'pair', loadComponent: () => import('./features/pairing/pairing.component').then(m => m.PairingComponent) },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'trips', loadComponent: () => import('./features/trips/trips.component').then(m => m.TripsComponent) },
      { path: 'charging', loadComponent: () => import('./features/charging/charging.component').then(m => m.ChargingComponent) },
      { path: 'statistics', loadComponent: () => import('./features/statistics/statistics.component').then(m => m.StatisticsComponent) },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
