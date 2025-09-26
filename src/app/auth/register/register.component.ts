// src/app/register/register.component.ts

// Importaciones principales de Angular
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register', // Nombre del selector para usar este componente en HTML
  standalone: true,         // Permite que sea un componente standalone (sin necesidad de declararlo en un módulo)
  imports: [
    CommonModule,
    ReactiveFormsModule,    // Necesario para formularios reactivos
    RouterModule            // Para poder usar routerLink y navegación
  ],
  templateUrl: './register.component.html', // Vista HTML asociada
  styleUrls: ['./register.component.css']   // Estilos CSS asociados
})
export class RegisterComponent {
  // Formulario reactivo
  registerForm: FormGroup;

  // Variable para mostrar errores al usuario
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,       // Construye el formulario de forma más sencilla
    private authService: AuthService, // Servicio de autenticación (Firebase u otro backend)
    private router: Router         // Para redirigir a otras rutas
  ) {
    // Inicialización del formulario con validaciones
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Método que se ejecuta al enviar el formulario
  async onSubmit() {
    this.errorMessage = null; // Reinicia los errores

    // Validar si el formulario es incorrecto antes de enviarlo
    if (this.registerForm.invalid) {
      this.errorMessage = 'Por favor completa todos los campos correctamente.';
      return;
    }

    // Extrae los valores del formulario
    const { username, email, password } = this.registerForm.value;

    try {
      // Llama al servicio de autenticación para registrar al usuario
      const registered = await this.authService.register(email, password, username);

      if (registered) {
        // Si se creó correctamente, redirige al login
        this.router.navigate(['/login']);
      } else {
        // Caso muy poco probable: no lanza error pero tampoco registra
        this.errorMessage = 'El registro falló por una razón desconocida. Intenta de nuevo.';
      }
    } catch (error: any) {
      // Manejo de errores específicos de Firebase
      switch (error.code) {
        case 'auth/email-already-in-use':
          this.errorMessage = 'El email ya está registrado. Intenta iniciar sesión.';
          break;
        case 'auth/invalid-email':
          this.errorMessage = 'El formato del email es incorrecto.';
          break;
        case 'auth/weak-password':
          this.errorMessage = 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.';
          break;
        default:
          // Errores no contemplados
          this.errorMessage = 'Error al registrar usuario: ' + error.message;
          console.error('Error de Firebase en registro:', error);
      }
    }
  }

  // Getters para facilitar el acceso a los campos desde la plantilla
  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
}
