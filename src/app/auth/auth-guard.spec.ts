import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { AuthGuard } from './auth-guard';

// Grupo de pruebas para el AuthGuard
describe('authGuard', () => {
  let guard: AuthGuard; // Instancia del guard a probar

  // Se ejecuta antes de cada prueba
  beforeEach(() => {
    // Configura el entorno de pruebas de Angular
    TestBed.configureTestingModule({
      providers: [AuthGuard] // Provee el guard para que pueda inyectarse
    });

    // Inyecta la instancia de AuthGuard
    guard = TestBed.inject(AuthGuard);
  });

  // Función auxiliar que ejecuta el método canActivate del guard
  const executeGuard: CanActivateFn = (route, state) =>
    guard.canActivate(route, state);

  // Prueba básica: verifica que el guard se cree y devuelva "true"
  it('should be created', () => {
    // Mock de route y state (no se necesitan valores reales para esta prueba básica)
    const mockRoute = {} as any;
    const mockState = {} as any;

    // Espera que el guard permita el acceso (true)
    expect(executeGuard(mockRoute, mockState)).toBeTruthy();
  });
});
