import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
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

  constructor() {}
}
