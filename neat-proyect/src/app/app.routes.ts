import { Routes } from '@angular/router';
import { LoginComponent } from './features/components/login/login.component';
import { DashboardComponent } from './features/components/dashboard/dashboard.component';
import { RegisterComponent } from './features/components/register/register.component';
import { AuthGuard } from './core/guards/auth.guard'; // Asegúrate de importar el AuthGuard
import { PublicAuthGuard } from './core/guards/publicAuth.guard'; // Asegúrate de importar el PublicAuthGuard
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';

export const routes: Routes = [
  // Ruta por defecto: Si el usuario no está autenticado, redirige a login
  {
    path: '',
    redirectTo: '/login', // Si no hay autenticación, redirige a login
    pathMatch: 'full',
  },
  {
    path: '',
    component: AuthLayoutComponent, // Usamos el layout de autenticación para las rutas login y registro
    children: [
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [PublicAuthGuard],
      }, // Solo usuarios no autenticados pueden acceder
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [PublicAuthGuard],
      }, // Solo usuarios no autenticados pueden acceder
    ],
  },
  {
    path: '',
    component: MainLayoutComponent, // Usamos el layout principal para las rutas protegidas
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
      }, // Solo usuarios autenticados pueden acceder
      // Agrega aquí otras rutas protegidas o de la app
    ],
  },

  // Agrega más rutas aquí según lo necesites
];
