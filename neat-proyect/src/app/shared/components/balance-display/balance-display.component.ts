import { AuthService } from './../../../core/services/auth/auth.service';
import { UserBalanceFirebaseService } from './../../../features/services/userBalanceFirebase/user-balance-firebase.service';
import { Component, inject, OnInit } from '@angular/core';
import { StatusCardData } from '../../interfaces/cards.interface';
import { StatusCardComponent } from '../status-card/status-card.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-balance-display',
  standalone: true,
  imports: [StatusCardComponent, NgFor],
  templateUrl: './balance-display.component.html',
  styleUrl: './balance-display.component.scss',
})
export class BalanceDisplayComponent implements OnInit {
  firebaseUserBalanceService = inject(UserBalanceFirebaseService);
  authService = inject(AuthService);
  usd_balance: number = 0;
  total_balance: number = 0;

  statusCards: StatusCardData[] = [
    {
      balance: 1000,
      status: 'saldo',
      coinBalance: 0,
      coinName: 'Etherium',
    },
    {
      balance: 2000,
      status: 'ganancia',
      coinBalance: 0,
      coinName: 'DodgeCoin',
    },
    {
      balance: 3000,
      status: 'perdida',
      coinBalance: 0,
      coinName: 'Bitcoin',
    },
  ];

  ngOnInit(): void {
    // Obtener el usuario autenticado
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        // Si el usuario está autenticado, obtener el balance usando su uid
        this.firebaseUserBalanceService
          .getUserBalanceData(user.uid)
          .subscribe((data) => {
            console.log('Datos de balance:', data);
            // Acceder al valor del balance en USD directamente si balances es un objeto
            this.usd_balance = data.balances['usd'] ?? 0; // Accede al balance en USD, o asigna 0 si no está definido
          });
      } else {
        console.log('No hay usuario autenticado');
      }
    });
  }
}
