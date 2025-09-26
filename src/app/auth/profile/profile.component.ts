// Importamos las dependencias necesarias desde Angular
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';   // Servicio de autenticación para manejar el usuario actual
import { CommonModule } from '@angular/common';  // Necesario para directivas estructurales (*ngIf, *ngFor, etc.)
import { RouterModule } from '@angular/router';  // Para poder usar enlaces con routerLink en la vista

// Decorador @Component: define las características del componente
//@Component: Convierte la clase en un componente de Angular, indicando cómo se va a usar y qué archivos (HTML, CSS, dependencias) tiene vinculados.
@Component({
  selector: 'app-profile',                       // Nombre de la etiqueta que se usará en HTML (<app-profile>)
  standalone: true,                              // Componente standalone (no necesita declararse en un módulo)
  imports: [CommonModule, RouterModule],         // Importa módulos que se pueden usar en el template
  templateUrl: './profile.component.html',       // Ruta del archivo HTML asociado al componente
  styleUrls: ['./profile.component.css']         // Ruta del archivo CSS asociado al componente
})
export class ProfileComponent {
  // Inyectamos el servicio de autenticación en el constructor
  // "public" lo hace accesible desde el template HTML (ej: authService.currentUserValue)
  constructor(public authService: AuthService) { }
}
