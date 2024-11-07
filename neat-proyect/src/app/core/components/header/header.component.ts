import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  authService = inject(AuthService);
  isAuthenticated = this.authService.currentUserSig;
  router = inject(Router);
  isMenuOpen = false;

  async logout(): Promise<void> {
    console.log('Logging out...');

    try {
      // Llamamos al logout y esperamos a que termine
      await this.authService.logout().toPromise();

      // Una vez que el logout haya terminado, actualizamos el estado del usuario
      this.authService.updateCurrentUser();

      // Esperamos un pequeño tiempo para que la actualización del estado se refleje correctamente
      // Podrías utilizar `await` o usar un `rxjs` delay para hacer esto de manera más controlada
      await new Promise((resolve) => setTimeout(resolve, 300)); // 300ms de espera

      // Redirigimos a la página de login
      this.router.navigateByUrl('/login');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  }
}
