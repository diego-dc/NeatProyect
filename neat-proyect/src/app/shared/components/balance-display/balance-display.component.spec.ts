import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceDisplayComponent } from './balance-display.component';

describe('BalanceDisplayComponent', () => {
  let component: BalanceDisplayComponent;
  let fixture: ComponentFixture<BalanceDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
