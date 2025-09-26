// Importaciones necesarias de Angular y librerías asociadas
import { Component, OnInit } from '@angular/core';
import { AuthService, AppUser } from './auth/auth.service'; // Servicio de autenticación y modelo de usuario
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs';

// Decorador que define el componente raíz de la aplicación
@Component({
  selector: 'app-root',                // Etiqueta personalizada usada en index.html
  standalone: true,                    // Indica que es un componente standalone (sin NgModule)
  imports: [CommonModule, RouterModule], // Módulos que este componente puede usar
  templateUrl: './app.component.html', // Plantilla HTML asociada
  styleUrls: ['./app.css'],            // Estilos CSS asociados
})
export class AppComponent implements OnInit {
  title = 'Rick & Morty App';  // Título de la aplicación
  currentUser$: Observable<AppUser | null>; // Observable que emite el usuario actual o null

  // Inyección de dependencias: AuthService para autenticación y Router para navegación
  constructor(
    public authService: AuthService,
    public router: Router
  ) {
    // currentUser$ toma el observable del servicio de autenticación
    this.currentUser$ = this.authService.currentUser;
  }

  // Método del ciclo de vida de Angular: se ejecuta al inicializar el componente
  ngOnInit(): void {
    // Lugar para lógica de inicialización, si fuese necesaria
  }

  // Método asíncrono para cerrar sesión
  async logout() {
    try {
      await this.authService.logout(); // Llama al servicio de logout
    } catch (error) {
      console.error('Error al cerrar sesión desde AppComponent:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  }
}
