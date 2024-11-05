import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { DashboardTypes } from '../../../shared/types/dashboard.types';

@Injectable({
  providedIn: 'root',
})
export class DashboardFirebaseService {
  firestore = inject(Firestore);
  dashboardCollection = collection(this.firestore, 'CryptoTransactions');

  getDashboardData(): Observable<DashboardTypes[]> {
    return collectionData(this.dashboardCollection, {
      idField: 'id',
    }) as Observable<DashboardTypes[]>;
  }

  constructor() {}
}
