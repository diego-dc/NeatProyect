import { Component, OnInit, inject } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { NgFor } from '@angular/common';
import { CardData } from '../../interfaces/cards.interface';
import { DashboardFirebaseService } from '../../../features/services/dashboardFirebase/dashboard-firebase.service';

@Component({
  selector: 'app-crypto-display',
  standalone: true,
  imports: [CardComponent, NgFor],
  templateUrl: './crypto-display.component.html',
  styleUrl: './crypto-display.component.scss',
})
export class CryptoDisplayComponent implements OnInit {
  cards: CardData[] = [];
  DashboardFirebaseService = inject(DashboardFirebaseService);

  ngOnInit(): void {
    this.DashboardFirebaseService.getCryptoData().subscribe((data) => {
      this.cards = data;
    });
    // Actualiza los valores cada 30 segundos
    // TODO: Implementar un servicio que actualice los valores de las criptomonedas
    setInterval(() => console.log('Actualizar Valores'), 30000); // Actualiza cada 30 segundos
  }
}
