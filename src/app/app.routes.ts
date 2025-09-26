/**
 * ============================
 * Archivo: app.routes.ts
 * 
 * Este archivo define las rutas principales de la aplicación
 * (routing en Angular).
 * 
 * En general:
 * - Cada objeto dentro del arreglo `routes` asocia un `path` (URL)
 *   con un componente que se debe renderizar.
 * - Se usan guardas (`AuthGuard`) para proteger ciertas rutas,
 *   asegurando que solo usuarios autenticados puedan acceder.
 * - Se incluye una ruta comodín (`'**'`) para redirigir a la raíz
 *   en caso de URL no reconocidas.
 * ============================
 */

import { Routes } from '@angular/router'; // Tipo de dato para definir rutas
import { CharacterTableComponent } from './components/character-table/character-table.component'; // Tabla de personajes
import { LoginComponent } from './auth/login/login.component'; // Formulario de inicio de sesión
import { RegisterComponent } from './auth/register/register.component'; // Formulario de registro
import { ProfileComponent } from './auth/profile/profile.component'; // Perfil del usuario
import { AuthGuard } from './auth/auth-guard'; // Guarda de autenticación para proteger rutas
import { FavoritesListComponent } from './components/favorites-list/favorites-list.component'; // Lista de favoritos

// Declaración de rutas de la aplicación
export const routes: Routes = [
  {
    path: '',                                // Ruta raíz ("/")
    component: CharacterTableComponent,      // Muestra la tabla de personajes
    canActivate: [AuthGuard]                 // Solo accesible si el usuario está autenticado
  },
  {
    path: 'login',                           // Ruta "/login"
    component: LoginComponent                // Muestra el login
  },
  {
    path: 'register',                        // Ruta "/register"
    component: RegisterComponent             // Muestra el registro de usuario
  },
  {
    path: 'profile',                         // Ruta "/profile"
    component: ProfileComponent,             // Muestra el perfil del usuario
    canActivate: [AuthGuard]                 // Protegida, requiere autenticación
  },
  {
    path: 'favorites',                       // Ruta "/favorites"
    component: FavoritesListComponent        // Lista de personajes favoritos
  },
  {
    path: '**',                              // Ruta comodín (cualquier otra URL)
    redirectTo: ''                           // Redirige a la raíz (tabla de personajes)
  }
];
