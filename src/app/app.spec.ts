/**
 * ============================
 * Archivo: app.component.spec.ts
 * 
 * Este archivo contiene pruebas unitarias para el componente raíz (`AppComponent`)
 * utilizando el framework de testing de Angular (Jasmine + TestBed).
 * 
 * En general:
 * - Configura un entorno de pruebas con `TestBed`.
 * - Verifica que el componente se cree correctamente.
 * - Verifica que se renderice el título esperado en la plantilla.
 * ============================
 */

import { provideZonelessChangeDetection } from '@angular/core'; // Permite pruebas sin Zone.js
import { TestBed } from '@angular/core/testing';                // Utilidad de Angular para pruebas unitarias
import { AppComponent } from './app.component';                 // Componente raíz que se prueba

// Grupo de pruebas para la aplicación
describe('App', () => {

  // Se ejecuta antes de cada prueba para configurar el entorno de testing
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],              // Declara el componente bajo prueba
      providers: [provideZonelessChangeDetection()] // Configuración adicional sin Zone.js
    }).compileComponents();                      // Compila los componentes declarados
  });

  // Primera prueba: asegura que el componente se cree correctamente
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent); // Se crea una instancia del componente
    const app = fixture.componentInstance;                 // Se obtiene la instancia
    expect(app).toBeTruthy();                              // Se espera que exista (no null / undefined)
  });

  // Segunda prueba: asegura que se renderiza el título en la vista
  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent); // Se crea el componente
    fixture.detectChanges();                               // Se dispara la detección de cambios para renderizar
    const compiled = fixture.nativeElement as HTMLElement; // Se accede al DOM renderizado
    expect(compiled.querySelector('h1')?.textContent)      // Busca el <h1> en la plantilla
      .toContain('Hello, Rick-and-morty');                 // Verifica que contenga el título esperado
  });
});
