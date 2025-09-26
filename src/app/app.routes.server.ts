/**
 * ============================
 * Archivo: server.routes.ts
 * 
 * Este archivo define las rutas que usará Angular
 * en el contexto de Server-Side Rendering (SSR).
 * 
 * En general:
 * - Se establece un "catch-all route" (path '**'),
 *   que captura cualquier ruta no especificada.
 * - A estas rutas se les aplica el modo de renderizado
 *   `RenderMode.Prerender`, lo que indica que deben
 *   prerenderizarse en tiempo de compilación.
 * ============================
 */

import { RenderMode, ServerRoute } from '@angular/ssr';
// RenderMode: define cómo se renderiza la ruta (SSR, prerender, etc.)
// ServerRoute: tipo de dato para declarar rutas de servidor

// Definición de las rutas del servidor
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',                        // Cualquier ruta (comodín o "catch-all")
    renderMode: RenderMode.Prerender   // Se prerenderiza (HTML estático generado en build)
  }
];
