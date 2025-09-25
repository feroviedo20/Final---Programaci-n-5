// src/app/app.config.ts

import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser'; // 'withEventReplay' se utiliza si 'provideClientHydration' está activo
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

// =========================================================================================
// CONFIGURACIÓN DE FIREBASE PARA EL PROYECTO 'parcial-api-43f07'
// =========================================================================================
// ¡VERIFICA ESTOS VALORES en la Consola de Firebase (Project settings -> Your apps -> Web app)!
// Deben coincidir EXACTAMENTE con los de tu proyecto.
const firebaseConfig = {
  apiKey: "AIzaSyDScMBtAN4nE9zb4yvjPaCp1a2G9Kv_M3w",
  authDomain: "parcial-api-43f07.firebaseapp.com",
  projectId: "parcial-api-43f07",
  storageBucket: "parcial-api-43f07.appspot.com",
  messagingSenderId: "343642574488",
  appId: "1:343642574488:web:5813c3e70a33e91ba0371b"
};
// =========================================================================================

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    // Activa la detección de cambios sin Zone.js (Zoneless Change Detection)
    // Asegúrate de haber quitado "zone.js" de los polyfills en angular.json
    provideZonelessChangeDetection(),

    provideRouter(routes),

    // --- CAMBIO AQUÍ: Comentada o eliminada si NO USAS SERVER-SIDE RENDERING (SSR) ---
    // provideClientHydration(withEventReplay()),

    provideHttpClient(),

    // =========================================================================================
    // Inicialización y provisión de los servicios de Firebase
    // =========================================================================================
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    UserTrackingService,
    provideFirestore(() => getFirestore())
    // =========================================================================================
  ]
};
