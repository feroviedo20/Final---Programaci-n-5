// Importa las utilidades de testing de Angular
import { TestBed } from '@angular/core/testing';

// Importa el servicio AuthService (asegúrate que el archivo se llama auth.service.ts)
import { AuthService } from './auth.service';

// Describe el grupo de pruebas para el servicio AuthService
describe('AuthService', () => {
  let service: AuthService; // Instancia del servicio a probar

  // Antes de cada prueba, configura el módulo de pruebas
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService] // Provee el servicio para inyección
    });
    service = TestBed.inject(AuthService); // Inyecta la instancia del servicio
  });

  // Prueba que el servicio se crea correctamente
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});