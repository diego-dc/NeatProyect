import { Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  user,
} from '@angular/fire/auth';
import { inject } from '@angular/core';
import { from, Observable } from 'rxjs';
import { UserInterface } from '../../../shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth);
  currentUserSig = signal<UserInterface | null | undefined>(undefined);

  isAuthenticated(): boolean {
    return (
      console.log('Current user isAuthenticated:', this.currentUserSig()),
      this.currentUserSig() !== null && this.currentUserSig() !== undefined
    );
  }

  register(
    email: string,
    username: string,
    password: string
  ): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((response) =>
      updateProfile(response.user, { displayName: username })
    );

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

  constructor() {}
}
