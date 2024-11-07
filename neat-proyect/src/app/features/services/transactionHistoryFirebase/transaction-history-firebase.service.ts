import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionHistoryFirebaseService {
  private firestore = inject(Firestore);
  private transactionHistoryCollection = collection(
    this.firestore,
    'Transaction_history'
  );

  // Método para agregar una transacción a la colección Transaction_history
  addTransaction(
    userId: string,
    cryptoName: string,
    amount: number,
    usdAmount: number,
    status: string
  ): Observable<string> {
    const transactionData = {
      user_id: userId,
      cryptoName,
      amount,
      usdAmount,
      status,
      date: new Date(),
    };

    const promise = addDoc(
      this.transactionHistoryCollection,
      transactionData
    ).then((returnedDoc) => {
      console.log('Transacción agregada con éxito:', returnedDoc.id);
      return returnedDoc.id;
    });

    return from(promise);
  }

  // Método para obtener el historial de transacciones de un usuario específico
  getTransactionHistory(userId: string): Observable<any[]> {
    const userTransactionQuery = query(
      this.transactionHistoryCollection,
      where('user_id', '==', userId)
    );

    return collectionData(userTransactionQuery, { idField: 'id' });
  }

  constructor() {}
}
