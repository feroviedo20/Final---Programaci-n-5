// Importa las utilidades de testing de Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Importa el componente RegisterComponent (asegúrate que el archivo se llama register.component.ts)
import { RegisterComponent } from './register.component';

// Describe el grupo de pruebas para el componente RegisterComponent
describe('RegisterComponent', () => {
  let component: RegisterComponent; // Instancia del componente a probar
  let fixture: ComponentFixture<RegisterComponent>; // Fixture para manipular el DOM y el componente

  // Antes de cada prueba, configura el módulo de pruebas
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent] // Declara el componente en el módulo de pruebas
    })
      .compileComponents(); // Compila los componentes

    fixture = TestBed.createComponent(RegisterComponent); // Crea una instancia del componente
    component = fixture.componentInstance; // Obtiene la instancia del componente
    fixture.detectChanges(); // Detecta los cambios iniciales
  });

  // Prueba que el componente se crea correctamente
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});