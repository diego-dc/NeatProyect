import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
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

  /**
   * Método para obtener los datos del balance de un usuario
   * @param userId - El ID del usuario
   * @returns Observable con los datos del balance del usuario
   */
  getUserBalanceData(userId: string): Observable<UserBalanceInterface> {
    const userDocRef = doc(this.firestore, `User_balances/${userId}`);
    return docData(userDocRef) as Observable<UserBalanceInterface>;
  }

  /**
   * Método para agregar un balance a un usuario
   * @param userId - El ID del usuario
   * @param balanceData - Los datos del balance del usuario
   * @returns Observable que emite el ID del documento de balance
   */
  addUserBalance(userId: string, balanceData: object): Observable<string> {
    const userBalanceDocRef = doc(this.userBalanceCollection, userId);

    // Verificamos si el documento ya existe
    const promise = getDoc(userBalanceDocRef).then(async (docSnapshot) => {
      if (docSnapshot.exists()) {
        console.log('El documento ya existe, no se realiza ninguna acción.');
        return docSnapshot.id;
      } else {
        await setDoc(userBalanceDocRef, {
          balances: balanceData,
        });
        console.log('Documento creado con éxito.');
        return userBalanceDocRef.id;
      }
    });

    return from(promise);
  }

  /**
   * Método para actualizar el balance de una criptomoneda y el balance en USD
   * @param userId - El ID del usuario
   * @param cryptoName - El nombre de la criptomoneda
   * @param amount - La cantidad de la criptomoneda a agregar o restar
   * @param usdAmount - El valor en USD asociado con el cambio
   * @returns Observable sin valor (void)
   */
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

        const currentUsdBalance = existingData['balances']?.['Dolares'] || 0;
        const updatedUsdBalance = currentUsdBalance + usdAmount;

        const status = usdAmount > 0 ? 'ganancia' : 'perdida';

        await setDoc(
          userBalanceDocRef,
          {
            balances: {
              [cryptoName]:
                (existingData?.['balances']?.[cryptoName] || 0) + amount,
              ['Dolares']: updatedUsdBalance,
            },
          },
          { merge: true }
        );

        console.log(`Balance de ${cryptoName} y USD actualizado con éxito.`);

        // Registramos la transacción en el historial
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
