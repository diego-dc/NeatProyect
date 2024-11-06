import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);

  errorMessage: string | null = null;

  form = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  async OnSubmit(): Promise<void> {
    const rawForm = this.form.getRawValue();

    try {
      // Realizamos el login y esperamos a que se complete
      await this.authService.login(rawForm.email, rawForm.password).toPromise();

      // Después de hacer login, aseguramos que el estado del usuario se actualice
      this.authService.updateCurrentUser();

      // Esperamos que se actualice el estado (puedes ajustar el tiempo según lo necesites)
      await new Promise((resolve) => setTimeout(resolve, 300)); // Retraso opcional si es necesario

      // Redirigimos al dashboard
      this.router.navigateByUrl('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        this.errorMessage = err.message;
      } else {
        this.errorMessage = 'An unknown error occurred';
      }
      console.error('Error during login:', err);
    }
  }
}
