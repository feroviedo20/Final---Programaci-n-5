// Importaciones desde Angular core y SSR (Server-Side Rendering)
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';       // Configuración principal de la app
import { serverRoutes } from './app.routes.server'; // Rutas específicas para el servidor

// Configuración para el servidor (SSR)
const serverConfig: ApplicationConfig = {
  providers: [
    // Habilita el renderizado en servidor y registra las rutas server-side
    provideServerRendering(withRoutes(serverRoutes))
  ]
};

// Combina la configuración general de la app con la del servidor
// Esto asegura que tanto las configuraciones comunes como las de SSR estén disponibles
export const config = mergeApplicationConfig(appConfig, serverConfig);
