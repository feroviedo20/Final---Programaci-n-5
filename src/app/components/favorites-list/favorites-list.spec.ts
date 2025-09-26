// Importaciones necesarias para pruebas en Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesListComponent } from './favorites-list.component';

// Grupo de pruebas para FavoritesListComponent
describe('FavoritesListComponent', () => {
  // Variables para manejar el componente en el entorno de prueba
  let component: FavoritesListComponent;
  let fixture: ComponentFixture<FavoritesListComponent>;

  // beforeEach se ejecuta antes de cada prueba individual
  beforeEach(async () => {
    // Se configura el módulo de pruebas de Angular
    await TestBed.configureTestingModule({
      // Como el componente es standalone, simplemente se importa
      imports: [FavoritesListComponent]
    })
      .compileComponents(); // Compila los componentes declarados

    // Crea una instancia del componente dentro del entorno de pruebas
    fixture = TestBed.createComponent(FavoritesListComponent);
    component = fixture.componentInstance; // Se obtiene la instancia del componente
    fixture.detectChanges(); // Se ejecuta la detección de cambios para inicializar el componente
  });

  // Caso de prueba básico: verificar que el componente se crea correctamente
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
