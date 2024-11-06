import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth/auth.service'; // Asegúrate de usar el servicio de autenticación

@Injectable({
  providedIn: 'root',
})
export class PublicAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.authService.isAuthenticated()) {
      console.log(this.authService.isAuthenticated());
      console.log('Usuario no autenticado, permitiendo acceso...');
      return true; // Permite el acceso si el usuario NO está autenticado
    } else {
      // Si el usuario está autenticado, lo redirige al Dashboard
      console.log('Usuario autenticado, redirigiendo al Dashboard...');
      this.router.navigate(['/dashboard']);
      return false; // Deniega el acceso
    }
  }
}
