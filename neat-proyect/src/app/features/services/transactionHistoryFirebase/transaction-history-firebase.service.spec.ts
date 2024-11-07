import { TestBed } from '@angular/core/testing';

import { TransactionHistoryFirebaseService } from './transaction-history-firebase.service';

describe('TransactionHistoryFirebaseService', () => {
  let service: TransactionHistoryFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionHistoryFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
