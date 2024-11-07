import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { DashboardTypes } from '../../../shared/types/dashboard.types';
import { CardData } from '../../../shared/interfaces/cards.interface';

@Injectable({
  providedIn: 'root',
})
export class DashboardFirebaseService {
  firestore = inject(Firestore);

  cryptoCollection = collection(this.firestore, 'Crypto');

  getCryptoData(): Observable<CardData[]> {
    return collectionData(this.cryptoCollection, {
      idField: 'id',
    }) as Observable<CardData[]>;
  }

  getConversionToDollars(name: string, value: number): Observable<number> {
    // Usamos la colección `cryptoCollection` para buscar el valor en dólares de la criptomoneda
    return collectionData(this.cryptoCollection).pipe(
      map((cryptoData: any[]) => {
        // Encontramos el valor de la criptomoneda por su nombre
        const crypto = cryptoData.find((item) => item.name === name);

        if (crypto) {
          // Si encontramos la criptomoneda, multiplicamos su valor en USD por el balance
          return crypto.value * value;
        } else {
          console.warn(`No se encontró la criptomoneda con el nombre ${name}`);
          return 0; // Retornamos 0 si no se encontró la criptomoneda
        }
      })
    );
  }

  constructor() {}
}
