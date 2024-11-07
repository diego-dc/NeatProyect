import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  errorMessage: string | null = null;

  async OnSubmit(): Promise<void> {
    const rawForm = this.form.getRawValue();

    try {
      // Realizamos el registro y esperamos a que se complete
      await this.authService
        .register(rawForm.email, rawForm.username, rawForm.password)
        .toPromise();

      // Después de que el registro se haya completado, aseguramos que el usuario esté actualizado
      this.authService.updateCurrentUser();

      // Esperamos a que se actualice el estado
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Ahora redirigimos al dashboard
      this.router.navigateByUrl('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        this.errorMessage = err.message;
      } else {
        this.errorMessage = 'An unknown error occurred';
      }
      console.error('Error during registration:', err);
    }
  }
}
