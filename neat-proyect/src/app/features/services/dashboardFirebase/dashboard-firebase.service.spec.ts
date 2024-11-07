import { TestBed } from '@angular/core/testing';

import { DashboardFirebaseService } from './dashboard-firebase.service';

describe('DashboardFirebaseService', () => {
  let service: DashboardFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
