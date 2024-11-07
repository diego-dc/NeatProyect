import { DashboardFirebaseService } from './../../services/dashboardFirebase/dashboard-firebase.service';
import { CardData } from '../../../shared/interfaces/cards.interface';
import { BalanceDisplayComponent } from './../../../shared/components/balance-display/balance-display.component';
import { CryptoDisplayComponent } from './../../../shared/components/crypto-display/crypto-display.component';
import { Component, inject, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UserBalanceFirebaseService } from '../../services/userBalanceFirebase/user-balance-firebase.service';
import { StatusCardComponent } from '../../../shared/components/status-card/status-card.component';
import { TransactionHistoryFirebaseService } from '../../services/transactionHistoryFirebase/transaction-history-firebase.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CryptoDisplayComponent,
    BalanceDisplayComponent,
    NgFor,
    ReactiveFormsModule,
    StatusCardComponent,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit {
  authService = inject(AuthService);
  dashboardFirebaseService = inject(DashboardFirebaseService);
  firebaseUserBalanceService = inject(UserBalanceFirebaseService);
  firebaseTransactionHistoryService = inject(TransactionHistoryFirebaseService);
  fb = inject(FormBuilder);

  transactionsHistory: any[] = []; // Aquí se almacenarán las transacciones

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

    // Obtener el historial de transacciones del usuario autenticado
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        // Si el usuario está autenticado, obtener el historial de transacciones usando su uid
        this.firebaseTransactionHistoryService
          .getTransactionHistory(user.uid)
          .subscribe((data) => {
            console.log('Historial de transacciones:', data);
            this.transactionsHistory = data; // Almacenar el historial de transacciones
          });
      }
    });

    // Suscribirse a los cambios en el campo de criptomoneda y cantidad
    this.formComprar.get('crypto')?.valueChanges.subscribe((cryptoName) => {
      if (cryptoName) {
        this.updateComprarConversionRate(cryptoName); // Actualiza la tasa de conversión
      }
    });

    this.formComprar.get('amount')?.valueChanges.subscribe(() => {
      this.updateComprarUsdAmount(); // Actualiza el valor en dólares
    });

    // Suscribirse a los cambios en el campo de criptomoneda y cantidad
    this.formVender.get('crypto')?.valueChanges.subscribe((cryptoName) => {
      if (cryptoName) {
        this.updateVenderConversionRate(cryptoName); // Actualiza la tasa de conversión
      }
    });

    this.formVender.get('amount')?.valueChanges.subscribe(() => {
      this.updateVenderUsdAmount(); // Actualiza el valor en dólares
    });
  }

  // Método para actualizar la tasa de conversión
  updateComprarConversionRate(cryptoName: string): void {
    const selectedCrypto = this.cryptoOptions.find(
      (crypto) => crypto.name === cryptoName
    );
    if (selectedCrypto) {
      this.conversionRate = parseFloat(selectedCrypto.value);
      this.updateComprarUsdAmount(); // Actualiza el valor en dólares
    }
  }

  // Método para calcular el valor en dólares de la cantidad de criptomonedas
  updateComprarUsdAmount(): void {
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

  // Método para actualizar la tasa de conversión
  updateVenderConversionRate(cryptoName: string): void {
    const selectedCrypto = this.cryptoOptions.find(
      (crypto) => crypto.name === cryptoName
    );
    if (selectedCrypto) {
      this.conversionRate = parseFloat(selectedCrypto.value);
      this.updateVenderUsdAmount(); // Actualiza el valor en dólares
    }
  }

  // Método para calcular el valor en dólares de la cantidad de criptomonedas
  updateVenderUsdAmount(): void {
    console.log('Actualizando valor en dólares');
    const amount = this.formVender.get('amount')?.value;
    if (amount && this.conversionRate) {
      console.log('Cantidad:', amount);
      const usdAmount = parseFloat(amount) * this.conversionRate;
      this.formVender.get('usdAmount')?.setValue(usdAmount.toFixed(2)); // Asigna el valor en dólares
    } else {
      this.formVender.get('usdAmount')?.setValue('0');
    }
  }

  // Método para manejar el submit del formulario
  onSubmitBuy(): void {
    if (this.formComprar.valid) {
      const formData = this.formComprar.value;
      console.log('Formulario enviado:', formData);
      // Aquí puedes agregar la lógica para manejar la compra o venta de la criptomoneda
      // Obtener el usuario autenticado
      this.authService.getCurrentUser().subscribe((user) => {
        if (user) {
          // Si el usuario está autenticado, obtener el balance usando su uid
          this.firebaseUserBalanceService.updateUserBalance(
            user.uid,
            formData.crypto || '',
            parseFloat(formData.amount || '0') || 0,
            -parseFloat(formData.amount || '0') * this.conversionRate || 0
          );
        }
      });
    } else {
      console.log('Formulario no válido');
    }
  }

  // Método para manejar el submit del formulario
  onSubmitSell(): void {
    if (this.formVender.valid) {
      const formData = this.formVender.value;
      console.log('Formulario enviado:', formData);
      // Obtener el usuario autenticado
      this.authService.getCurrentUser().subscribe((user) => {
        if (user) {
          // Si el usuario está autenticado, obtener el balance usando su uid
          this.firebaseUserBalanceService.updateUserBalance(
            user.uid,
            formData.crypto || '',
            -parseFloat(formData.amount || '0') || 0,
            parseFloat(formData.amount || '0') * this.conversionRate || 0
          );
        }
      });
    } else {
      console.log('Formulario no válido');
    }
  }
}
