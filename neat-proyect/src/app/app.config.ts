import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp, getApp } from '@angular/fire/app';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAuth, getAuth } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCu9kI39rO-1RNEblZyfFUsdmvno9M2ZAs',
  authDomain: 'neatproyect.firebaseapp.com',
  databaseURL: 'https://neatproyect-default-rtdb.firebaseio.com',
  projectId: 'neatproyect',
  storageBucket: 'neatproyect.firebasestorage.app',
  messagingSenderId: '549102750797',
  appId: '1:549102750797:web:93d4ce591c6e8bcd57e004',
  measurementId: 'G-BWGDWRHGRG',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],
};
