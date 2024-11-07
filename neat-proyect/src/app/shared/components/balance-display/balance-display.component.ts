import { AuthService } from './../../../core/services/auth/auth.service';
import { UserBalanceFirebaseService } from './../../../features/services/userBalanceFirebase/user-balance-firebase.service';
import { Component, inject, OnInit } from '@angular/core';
import { StatusCardData } from '../../interfaces/cards.interface';
import { StatusCardComponent } from '../status-card/status-card.component';
import { NgFor } from '@angular/common';
import { DashboardFirebaseService } from '../../../features/services/dashboardFirebase/dashboard-firebase.service';

@Component({
  selector: 'app-balance-display',
  standalone: true,
  imports: [StatusCardComponent, NgFor],
  templateUrl: './balance-display.component.html',
  styleUrl: './balance-display.component.scss',
})
export class BalanceDisplayComponent implements OnInit {
  firebaseDashboardService = inject(DashboardFirebaseService);
  firebaseUserBalanceService = inject(UserBalanceFirebaseService);
  authService = inject(AuthService);
  usd_balance: number = 0;
  total_balance: number = 0;

  statusCards: StatusCardData[] = [];

  ngOnInit(): void {
    // Obtener el usuario autenticado
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        // Si el usuario está autenticado, obtener el balance usando su uid
        this.firebaseUserBalanceService
          .getUserBalanceData(user.uid)
          .subscribe((data) => {
            // Reiniciar la lista de statusCards y total_balance antes de procesar los nuevos datos
            this.statusCards = [];
            this.total_balance = 0;
            // Acceder al valor del balance en USD directamente si balances es un objeto
            this.usd_balance = data.balances['Dolares'] ?? 0; // Accede al balance en USD, o asigna 0 si no está definido
            this.total_balance += this.usd_balance;
            // Se guarda en StatusCardData el valor de los balances de las otras monedas
            for (const [key, value] of Object.entries(data.balances)) {
              if (key !== 'Dolares') {
                // Suscribirse al Observable devuelto por getConversionToDollars
                this.firebaseDashboardService
                  .getConversionToDollars(key, value)
                  .subscribe((convertedValue) => {
                    this.total_balance += convertedValue;
                    // Una vez que tengamos el valor convertido, lo agregamos a statusCards
                    this.statusCards.push({
                      coinName: key,
                      coinBalance: value, // Aquí usamos el valor directamente
                      balance: convertedValue, // Aquí ponemos el valor convertido en USD
                      status: 'saldo',
                    });
                  });
              }
            }
          });
      } else {
        console.log('No hay usuario autenticado');
      }
    });
  }
}
