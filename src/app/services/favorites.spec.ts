// Importa las utilidades de testing de Angular
import { TestBed } from '@angular/core/testing';

// Importa el servicio FavoritesService (asegúrate que el archivo se llama favorites.service.ts)
import { FavoritesService } from './favorites.service';

// Describe el grupo de pruebas para el servicio FavoritesService
describe('FavoritesService', () => {
  let service: FavoritesService; // Instancia del servicio a probar

  // Antes de cada prueba, configura el módulo de pruebas
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FavoritesService] // Provee el servicio para inyección
    });
    service = TestBed.inject(FavoritesService); // Inyecta la instancia del servicio
  });

  // Prueba que el servicio se crea correctamente
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});