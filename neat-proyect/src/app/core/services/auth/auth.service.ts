// Importamos el servicio de balance de usuario y otros módulos necesarios de Firebase
import { UserBalanceFirebaseService } from './../../../features/services/userBalanceFirebase/user-balance-firebase.service';
import { Injectable, signal } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
  user,
} from '@angular/fire/auth';
import { inject } from '@angular/core';
import { from, Observable } from 'rxjs';
import { UserInterface } from '../../../shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root', // El servicio está disponible en toda la aplicación
})
export class AuthService {
  // Inyectamos el servicio de autenticación de Firebase y el servicio de balance de usuario
  firebaseAuth = inject(Auth);
  firebaseUserBalanceService = inject(UserBalanceFirebaseService);

  // Creación de un signal para almacenar el estado del usuario actual
  user$ = user(this.firebaseAuth);
  currentUserSig = signal<UserInterface | null | undefined>(undefined);

  /**
   * Método para verificar si el usuario está autenticado
   * @returns true si el usuario está autenticado, false en caso contrario
   */
  isAuthenticated(): boolean {
    // Retorna el estado de autenticación del usuario
    return (
      console.log('Current user isAuthenticated:', this.currentUserSig()),
      this.currentUserSig() !== null && this.currentUserSig() !== undefined
    );
  }

  /**
   * Método para obtener el usuario autenticado como Observable
   * @returns Observable que emite el estado del usuario actual (User | null)
   */
  getCurrentUser(): Observable<User | null> {
    return authState(this.auth); // authState devuelve un Observable con el estado del usuario
  }

  /**
   * Método para registrar un nuevo usuario
   * @param email - Correo electrónico del usuario
   * @param username - Nombre de usuario
   * @param password - Contraseña del usuario
   * @returns Observable que emite la respuesta de la promesa de registro
   */
  register(
    email: string,
    username: string,
    password: string
  ): Observable<void> {
    // Creamos una promesa para registrar al usuario con el correo y la contraseña
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((response) => {
      // Una vez registrado el usuario, actualizamos su nombre de usuario en el perfil
      updateProfile(response.user, { displayName: username }).then(() => {
        // Asignamos un balance aleatorio en USD entre 100 y 10000 para el nuevo usuario
        const randomBalance =
          Math.floor(Math.random() * (10000 - 100 + 1)) + 100;

        // Usamos el servicio de balance de usuario para crear el balance inicial
        this.firebaseUserBalanceService.addUserBalance(response.user.uid, {
          Dolares: randomBalance, // Asignamos el balance aleatorio en USD
        });
      });
    });
    // Retornamos la promesa envuelta en un Observable
    return from(promise);
  }

  /**
   * Método para iniciar sesión con el correo electrónico y la contraseña
   * @param email - Correo electrónico del usuario
   * @param password - Contraseña del usuario
   * @returns Observable que emite la respuesta de la promesa de login
   */
  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(() => {}); // No se realiza ninguna acción adicional después del login
    return from(promise); // Retornamos la promesa envuelta en un Observable
  }

  /**
   * Método para cerrar sesión
   * @returns Observable que emite la respuesta de la promesa de logout
   */
  logout(): Observable<void> {
    const promise = this.firebaseAuth.signOut(); // Llamamos al método de Firebase para cerrar sesión
    return from(promise); // Retornamos la promesa envuelta en un Observable
  }

  /**
   * Método para actualizar el estado del usuario actual en el signal
   * Este método escucha el estado del usuario autenticado y actualiza el signal
   */
  updateCurrentUser(): void {
    this.user$.subscribe(
      (user: { email: string; displayName: string } | null) => {
        if (user) {
          // Si el usuario está autenticado, actualizamos el signal con los datos del usuario
          this.currentUserSig.set({
            email: user.email!, // Establecemos el correo del usuario
            username: user.displayName!, // Establecemos el nombre de usuario
          });
        } else {
          // Si no hay usuario autenticado, seteamos el signal a null
          this.currentUserSig.set(null);
        }
        console.log('Current user:', this.currentUserSig()); // Logueamos el estado del usuario actual
      }
    );
  }

  constructor(private auth: Auth) {} // Inyectamos el servicio de autenticación de Firebase
}
