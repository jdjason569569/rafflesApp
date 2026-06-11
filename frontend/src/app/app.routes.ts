import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { AdminDashboardComponent } from './features/admin-dashboard/admin-dashboard.component';
import { GuestDashboardComponent } from './features/guest-dashboard/guest-dashboard.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'admin-dashboard', 
    component: AdminDashboardComponent,
    canActivate: [authGuard],
    data: { role: 'admin' }
  },
  { 
    path: 'guest-dashboard', 
    component: GuestDashboardComponent,
    canActivate: [authGuard],
    data: { role: 'guest' }
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
