import { TestBed } from '@angular/core/testing';

import { UserBalanceFirebaseService } from './user-balance-firebase.service';

describe('UserBalanceFirebaseService', () => {
  let service: UserBalanceFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserBalanceFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
