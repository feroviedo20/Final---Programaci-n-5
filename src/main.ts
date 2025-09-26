/*
============================================
Archivo: main.ts

Este archivo es el punto de entrada de la aplicación Angular.

En general:
- Se encarga de "bootstrapping", es decir, iniciar la aplicación.
- Carga el componente raíz (AppComponent).
- Aplica la configuración general de la aplicación (appConfig).
- Maneja errores en caso de que la inicialización falle.

En pocas palabras: es el archivo que le dice a Angular
"arrancá la aplicación con este componente principal".
============================================
*/

import { bootstrapApplication } from '@angular/platform-browser'; // Función para iniciar la app Angular en el navegador
import { appConfig } from './app/app.config'; // Configuración de la aplicación (servicios, rutas, etc.)
import { AppComponent } from './app/app.component'; // Componente raíz que representa la aplicación

// Bootstrap de la aplicación: se inicia con AppComponent y la configuración indicada
bootstrapApplication(AppComponent, appConfig)
  // Si ocurre un error en el arranque, se captura y muestra en consola
  .catch((err) => console.error(err));
