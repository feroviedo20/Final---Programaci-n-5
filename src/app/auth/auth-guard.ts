import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

// Decorador que marca la clase como inyectable y disponible en toda la app
@Injectable({
  providedIn: 'root' // Se provee a nivel raíz, no hace falta declararlo en un módulo
})
export class AuthGuard implements CanActivate {
  // Inyección de dependencias:
  // - AuthService: para saber si hay un usuario logueado
  // - Router: para redirigir si no está logueado
  constructor(private authService: AuthService, private router: Router) { }

  // Método principal del guard que decide si se puede activar una ruta
  canActivate(
    next: ActivatedRouteSnapshot,     // Información de la ruta que se intenta activar
    state: RouterStateSnapshot        // Estado del router (incluye la URL actual)
  ): boolean {
    // Si el usuario está logueado (AuthService tiene un usuario actual)
    if (this.authService.currentUserValue) {
      return true; // Permite el acceso a la ruta
    }

    // Si no hay usuario logueado:
    // Redirige al login y pasa la URL de retorno para después volver aquí
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false; // Bloquea el acceso
  }
}
