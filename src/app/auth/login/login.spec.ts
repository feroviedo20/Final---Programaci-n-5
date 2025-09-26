// Importa las utilidades de testing de Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';
// Importa el componente LoginComponent (asegúrate que el archivo se llama login.component.ts)
import { LoginComponent } from './login.component';

// Describe el grupo de pruebas para el componente LoginComponent
describe('LoginComponent', () => {
  let component: LoginComponent; // Instancia del componente a probar
  let fixture: ComponentFixture<LoginComponent>; // Fixture para manipular el DOM y el componente

  // Antes de cada prueba, configura el módulo de pruebas
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent] // Declara el componente en el módulo de pruebas
    })
      .compileComponents(); // Compila los componentes

    fixture = TestBed.createComponent(LoginComponent); // Crea una instancia del componente
    component = fixture.componentInstance; // Obtiene la instancia del componente
    fixture.detectChanges(); // Detecta los cambios iniciales
  });

  // Prueba que el componente se crea correctamente
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});