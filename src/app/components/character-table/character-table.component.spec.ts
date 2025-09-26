import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterTableComponent } from './character-table.component';

describe('CharacterTableComponent', () => {
  let component: CharacterTableComponent; // Instancia del componente que se va a probar
  let fixture: ComponentFixture<CharacterTableComponent>; // Fixture para acceder al componente y su template

  beforeEach(async () => {
    // Configuración del entorno de pruebas
    await TestBed.configureTestingModule({
      declarations: [CharacterTableComponent]  // Se declara el componente que se va a testear
    })
      .compileComponents(); // Compila los componentes declarados para que puedan usarse en las pruebas

    // Crea la instancia del componente y la enlaza con el fixture
    fixture = TestBed.createComponent(CharacterTableComponent);
    component = fixture.componentInstance;

    // Detecta los cambios iniciales en el template del componente
    fixture.detectChanges();
  });

  it('should create', () => {
    // Prueba básica: verifica que el componente se haya creado correctamente
    expect(component).toBeTruthy();
  });
});
