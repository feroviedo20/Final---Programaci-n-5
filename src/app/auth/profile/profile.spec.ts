// Importa las utilidades de testing de Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Importa el componente ProfileComponent (asegúrate que el archivo se llama profile.component.ts)
import { ProfileComponent } from './profile.component';

// Describe el grupo de pruebas para el componente ProfileComponent
describe('ProfileComponent', () => {
  let component: ProfileComponent; // Instancia del componente a probar
  let fixture: ComponentFixture<ProfileComponent>; // Fixture para manipular el DOM y el componente

  // Antes de cada prueba, configura el módulo de pruebas
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileComponent] // Declara el componente en el módulo de pruebas
    })
      .compileComponents(); // Compila los componentes

    fixture = TestBed.createComponent(ProfileComponent); // Crea una instancia del componente
    component = fixture.componentInstance; // Obtiene la instancia del componente
    fixture.detectChanges(); // Detecta los cambios iniciales
  });

  // Prueba que el componente se crea correctamente
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});