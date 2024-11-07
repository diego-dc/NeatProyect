import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { CardData } from '../../../shared/interfaces/cards.interface';

@Injectable({
  providedIn: 'root',
})
export class DashboardFirebaseService {
  // Inyectamos el servicio Firestore de Firebase
  firestore = inject(Firestore);

  // Definimos la colección de criptomonedas que está en Firestore
  cryptoCollection = collection(this.firestore, 'Crypto');

  /**
   * Método para obtener los datos de la colección Crypto desde Firestore
   * @returns Observable que emite una lista de objetos CardData que representan las criptomonedas
   */
  getCryptoData(): Observable<CardData[]> {
    // Usamos collectionData para obtener los datos de la colección y asignamos el campo `id` como identificador
    return collectionData(this.cryptoCollection, {
      idField: 'id', // Agregamos un campo `id` a cada documento
    }) as Observable<CardData[]>; // Aseguramos que el tipo de los datos es CardData[]
  }

  /**
   * Método para obtener la conversión de una criptomoneda a dólares
   * @param name - El nombre de la criptomoneda que se quiere convertir
   * @param value - El valor de la cantidad de la criptomoneda que se tiene
   * @returns Observable que emite el valor de la conversión en dólares
   */
  getConversionToDollars(name: string, value: number): Observable<number> {
    // Usamos la colección `cryptoCollection` para buscar el valor en dólares de la criptomoneda
    return collectionData(this.cryptoCollection).pipe(
      // Aplicamos un operador `map` para transformar los datos de la colección
      map((cryptoData: any[]) => {
        // Buscamos la criptomoneda que coincida con el nombre proporcionado
        const crypto = cryptoData.find((item) => item.name === name);

        if (crypto) {
          // Si encontramos la criptomoneda, multiplicamos su valor por la cantidad deseada
          return crypto.value * value;
        } else {
          // Si no encontramos la criptomoneda, mostramos una advertencia y retornamos 0
          console.warn(`No se encontró la criptomoneda con el nombre ${name}`);
          return 0; // Retornamos 0 si no se encontró la criptomoneda
        }
      })
    );
  }

  constructor() {}
}
