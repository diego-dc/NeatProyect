import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoDisplayComponent } from './crypto-display.component';

describe('CryptoDisplayComponent', () => {
  let component: CryptoDisplayComponent;
  let fixture: ComponentFixture<CryptoDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CryptoDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CryptoDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
