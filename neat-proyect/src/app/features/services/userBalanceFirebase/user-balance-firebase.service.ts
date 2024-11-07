import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  getDoc,
  setDoc,
} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { UserBalanceInterface } from '../../../shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserBalanceFirebaseService {
  firestore = inject(Firestore);

  userBalanceCollection = collection(this.firestore, 'User_balances');

  getUserBalanceData(userId: string): Observable<UserBalanceInterface> {
    const userDocRef = doc(this.firestore, `User_balances/${userId}`);
    return docData(userDocRef) as Observable<UserBalanceInterface>;
  }

  // Método para agregar un balance a un usuario
  addUserBalance(userId: string, balanceData: object): Observable<string> {
    // Referencia al documento de balances del usuario (usamos 'doc' para acceder a un documento específico)
    const userBalanceDocRef = doc(this.userBalanceCollection, userId);

    // Verificar si el documento ya existe
    const promise = getDoc(userBalanceDocRef).then(async (docSnapshot) => {
      if (docSnapshot.exists()) {
        // Si el documento ya existe, ignoramos la creación
        console.log('El documento ya existe, no se realiza ninguna acción.');
        return docSnapshot.id; // O cualquier otro valor que te gustaría devolver
      } else {
        // Si no existe, creamos el documento y le añadimos el contenido de balance
        await setDoc(userBalanceDocRef, {
          balances: balanceData,
        });
        console.log('Documento creado con éxito.');
        return userBalanceDocRef.id; // Retornamos el ID del nuevo documento creado
      }
    });

    // Devolver la promesa como un Observable
    return from(promise);
  }

  constructor() {}
}
