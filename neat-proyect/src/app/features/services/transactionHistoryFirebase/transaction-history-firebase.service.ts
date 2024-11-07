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
  // Inyectamos el servicio Firestore de Firebase
  private firestore = inject(Firestore);

  // Definimos la colección de historial de transacciones en Firestore
  private transactionHistoryCollection = collection(
    this.firestore,
    'Transaction_history'
  );

  /**
   * Método para agregar una transacción a la colección Transaction_history
   * @param userId - El ID del usuario que realiza la transacción
   * @param cryptoName - El nombre de la criptomoneda que se está utilizando
   * @param amount - La cantidad de criptomoneda en la transacción
   * @param usdAmount - El valor de la cantidad de criptomoneda en dólares
   * @param status - El estado de la transacción para el status card
   * @returns Observable que emite el ID de la transacción añadida
   */
  addTransaction(
    userId: string,
    cryptoName: string,
    amount: number,
    usdAmount: number,
    status: string
  ): Observable<string> {
    // Creamos el objeto de datos para la transacción
    const transactionData = {
      user_id: userId,
      cryptoName,
      amount,
      usdAmount,
      status,
      date: new Date(), // Añadimos la fecha actual de la transacción
    };

    // Creamos una promesa para agregar la transacción a la colección de Firestore
    const promise = addDoc(
      this.transactionHistoryCollection,
      transactionData
    ).then((returnedDoc) => {
      // Imprimimos el ID de la transacción agregada con éxito
      console.log('Transacción agregada con éxito:', returnedDoc.id);
      // Retornamos el ID de la transacción
      return returnedDoc.id;
    });

    // Devolvemos la promesa envuelta en un Observable
    return from(promise);
  }

  /**
   * Método para obtener el historial de transacciones de un usuario específico
   * @param userId - El ID del usuario cuya historia de transacciones queremos obtener
   * @returns Observable que emite una lista de transacciones del usuario
   */
  getTransactionHistory(userId: string): Observable<any[]> {
    // Creamos una consulta para filtrar las transacciones por el ID del usuario
    const userTransactionQuery = query(
      this.transactionHistoryCollection,
      where('user_id', '==', userId) // Filtramos las transacciones por el user_id
    );

    // Usamos collectionData para obtener los datos filtrados de la consulta
    return collectionData(userTransactionQuery, { idField: 'id' });
  }

  constructor() {}
}
