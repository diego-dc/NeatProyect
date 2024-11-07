import { BalanceDisplayComponent } from '../../../shared/components/balance-display/balance-display.component';
import { CryptoDisplayComponent } from './../../../shared/components/crypto-display/crypto-display.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CryptoDisplayComponent, BalanceDisplayComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
