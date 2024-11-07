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
import { TransactionHistoryFirebaseService } from '../transactionHistoryFirebase/transaction-history-firebase.service';

@Injectable({
  providedIn: 'root',
})
export class UserBalanceFirebaseService {
  firestore = inject(Firestore);

  userBalanceCollection = collection(this.firestore, 'User_balances');
  transactionHistoryService = inject(TransactionHistoryFirebaseService);

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

  // Método para actualizar la cantidad de una criptomoneda específica y el balance en USD
  updateUserBalance(
    userId: string,
    cryptoName: string,
    amount: number,
    usdAmount: number
  ): Observable<void> {
    const userBalanceDocRef = doc(this.firestore, `User_balances/${userId}`);

    const promise = getDoc(userBalanceDocRef).then(async (docSnapshot) => {
      if (docSnapshot.exists()) {
        const existingData = docSnapshot.data();

        console.log('Datos existentes:', existingData);

        // Obtener balance actual en USD si existe, de lo contrario, usar 0
        const currentUsdBalance = existingData['balances']?.['Dolares'] || 0;

        // Calcular nuevo balance en USD sumando/restando el valor de usdAmount
        const updatedUsdBalance = currentUsdBalance + usdAmount;

        // Determinar el estado de la transacción
        const status = usdAmount > 0 ? 'ganancia' : 'perdida';

        // Actualizar el balance de la criptomoneda y el balance en USD
        await setDoc(
          userBalanceDocRef,
          {
            balances: {
              [cryptoName]:
                (existingData?.['balances']?.[cryptoName] || 0) + amount, // Sumar/restar el balance de la crypto
              ['Dolares']: updatedUsdBalance, // Actualizar el balance en USD
            },
          },
          { merge: true }
        );

        console.log(`Balance de ${cryptoName} y USD actualizado con éxito.`);
        // Llamar al servicio para agregar la transacción a Transaction_history
        this.transactionHistoryService
          .addTransaction(
            userId,
            cryptoName,
            amount,
            Math.abs(usdAmount),
            status
          )
          .subscribe(() =>
            console.log('Transacción registrada en Transaction_history')
          );
      } else {
        console.error(
          'El documento no existe. No se pudo actualizar el balance.'
        );
      }
    });

    return from(promise);
  }

  constructor() {}
}
