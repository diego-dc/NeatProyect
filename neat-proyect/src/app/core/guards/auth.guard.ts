import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Verificar si el usuario está autenticado
    if (this.authService.isAuthenticated()) {
      console.log('Usuario autenticado');
      console.log('Usuario:', this.authService.currentUserSig());
      return true; // Permitir el acceso
    } else {
      // Si no está autenticado, redirigir al login
      console.log('Usuario no autenticado, redirigiendo al login...');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
