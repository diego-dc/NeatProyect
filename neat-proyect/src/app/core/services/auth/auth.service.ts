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
import { Firestore, collection, collectionData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);
  firebaseUserBalanceService = inject(UserBalanceFirebaseService);

  user$ = user(this.firebaseAuth);
  currentUserSig = signal<UserInterface | null | undefined>(undefined);

  isAuthenticated(): boolean {
    return (
      console.log('Current user isAuthenticated:', this.currentUserSig()),
      this.currentUserSig() !== null && this.currentUserSig() !== undefined
    );
  }

  // Método para obtener el usuario autenticado como Observable
  getCurrentUser(): Observable<User | null> {
    return authState(this.auth); // authState devuelve un Observable<User | null>
  }

  register(
    email: string,
    username: string,
    password: string
  ): Observable<void> {
    // Crear la promesa para registrar al usuario
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((response) => {
      // Actualizar el perfil con el nombre de usuario
      updateProfile(response.user, { displayName: username }).then(() => {
        // Crear un balance inicial aleatorio en USD entre 100 y 10000
        const randomBalance =
          Math.floor(Math.random() * (10000 - 100 + 1)) + 100;

        // Crear el balance del usuario
        this.firebaseUserBalanceService.addUserBalance(response.user.uid, {
          Bitcoin: 0.0, // Inicializa con 0 BTC
          Etherium: 0.0, // Inicializa con 0 ETH
          Litecoin: 0.0, // Inicializa con 0 LTC
          Dolares: randomBalance, // Asigna el balance aleatorio en USD
        });
      });
    });
    // Retornamos la promesa envuelta en un Observable
    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(() => {});
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = this.firebaseAuth.signOut();
    return from(promise);
  }

  updateCurrentUser(): void {
    this.user$.subscribe(
      (user: { email: string; displayName: string } | null) => {
        if (user) {
          // Si hay un usuario, actualizamos el signal
          this.currentUserSig.set({
            email: user.email!,
            username: user.displayName!,
          });
        } else {
          // Si no hay usuario, seteamos el signal a null
          this.currentUserSig.set(null);
        }
        console.log('Current user:', this.currentUserSig());
      }
    );
  }

  constructor(private auth: Auth) {}
}
