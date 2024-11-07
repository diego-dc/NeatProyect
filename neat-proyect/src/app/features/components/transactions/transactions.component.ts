import { DashboardFirebaseService } from './../../services/dashboardFirebase/dashboard-firebase.service';
import { CardData } from '../../../shared/interfaces/cards.interface';
import { BalanceDisplayComponent } from './../../../shared/components/balance-display/balance-display.component';
import { CryptoDisplayComponent } from './../../../shared/components/crypto-display/crypto-display.component';
import { Component, inject, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CryptoDisplayComponent,
    BalanceDisplayComponent,
    NgFor,
    ReactiveFormsModule,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit {
  dashboardFirebaseService = inject(DashboardFirebaseService);
  fb = inject(FormBuilder);

  cryptoOptions: CardData[] = []; // Aquí se almacenarán las criptomonedas
  amount: number = 0; // Para almacenar la cantidad de criptomonedas a comprar
  conversionRate: number = 0; // Para almacenar la tasa de conversión de la criptomoneda seleccionada

  // Crear el formulario
  formVender = this.fb.group({
    crypto: ['', Validators.required], // Criptomoneda seleccionada
    amount: ['', [Validators.required, Validators.min(0)]], // Cantidad a comprar
    usdAmount: [{ value: '0', disabled: true }], // Valor en dólares
  });

  // Crear el formulario
  formComprar = this.fb.group({
    crypto: ['', Validators.required], // Criptomoneda seleccionada
    amount: ['', [Validators.required, Validators.min(0)]], // Cantidad a comprar
    usdAmount: [{ value: '0', disabled: true }], // Valor en dólares
  });

  ngOnInit(): void {
    // Obtener las criptomonedas desde el servicio
    this.dashboardFirebaseService
      .getCryptoData()
      .subscribe((cryptoData: CardData[]) => {
        console.log('Criptomonedas:', cryptoData);
        this.cryptoOptions = cryptoData; // Almacenar las criptomonedas en el array
      });

    // Suscribirse a los cambios en el campo de criptomoneda y cantidad
    this.formComprar.get('crypto')?.valueChanges.subscribe((cryptoName) => {
      if (cryptoName) {
        this.updateConversionRate(cryptoName); // Actualiza la tasa de conversión
      }
    });

    this.formComprar.get('amount')?.valueChanges.subscribe(() => {
      this.updateUsdAmount(); // Actualiza el valor en dólares
    });
  }

  // Método para actualizar la tasa de conversión
  updateConversionRate(cryptoName: string): void {
    const selectedCrypto = this.cryptoOptions.find(
      (crypto) => crypto.name === cryptoName
    );
    if (selectedCrypto) {
      this.conversionRate = parseFloat(selectedCrypto.value); // Asumiendo que 'value' es el valor en USD
      this.updateUsdAmount(); // Actualiza el valor en dólares
    }
  }

  // Método para calcular el valor en dólares de la cantidad de criptomonedas
  updateUsdAmount(): void {
    console.log('Actualizando valor en dólares');
    const amount = this.formComprar.get('amount')?.value;
    if (amount && this.conversionRate) {
      console.log('Cantidad:', amount);
      const usdAmount = parseFloat(amount) * this.conversionRate;
      this.formComprar.get('usdAmount')?.setValue(usdAmount.toFixed(2)); // Asigna el valor en dólares
    } else {
      this.formComprar.get('usdAmount')?.setValue('0');
    }
  }

  // Método para manejar el submit del formulario
  onSubmit(): void {
    if (this.formComprar.valid) {
      const formData = this.formComprar.value;
      console.log('Formulario enviado:', formData);
      // Aquí puedes agregar la lógica para manejar la compra o venta de la criptomoneda
    } else {
      console.log('Formulario no válido');
    }
  }
}
