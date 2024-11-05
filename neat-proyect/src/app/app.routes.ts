import { Routes } from '@angular/router';
import { LoginComponent } from './features/components/login/login.component';
import { DashboardComponent } from './features/components/dashboard/dashboard.component';
import { RegisterComponent } from './features/components/register/register.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
];
