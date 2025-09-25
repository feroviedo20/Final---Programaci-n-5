// src/app/login/login.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service'; // Asegúrate de la ruta correcta
import { CommonModule } from '@angular/common'; // Necesario para *ngIf

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null; // Para mostrar errores de Firebase o validación

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Si el usuario ya está logueado, redirigir a la página principal.
    // Esto previene que un usuario autenticado acceda a la página de login.
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }

    // Inicialización del formulario reactivo con validadores
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Aquí puedes añadir lógica que se ejecute cuando el componente se inicialice, si es necesario.
  }

  // Método para manejar el envío del formulario
  async onSubmit() {
    this.errorMessage = null; // Limpiar cualquier mensaje de error anterior

    // Validar el formulario antes de intentar el login
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor ingresa un email y contraseña válidos.';
      return; // No proceder si el formulario es inválido
    }

    const { email, password } = this.loginForm.value; // Obtener credenciales del formulario

    try {
      await this.authService.login(email, password);
      // Si el login es exitoso, el onAuthStateChanged en AuthService ya actualizó el estado
      // Redirigir al usuario a la página principal o a donde sea apropiado
      this.router.navigate(['/']);
    } catch (error: any) {
      // Manejo de errores específicos de Firebase Authentication
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          this.errorMessage = 'Credenciales inválidas. Verifica tu email y contraseña.';
          break;
        case 'auth/invalid-email':
          this.errorMessage = 'El formato del email es incorrecto.';
          break;
        case 'auth/user-disabled':
          this.errorMessage = 'Tu cuenta ha sido deshabilitada. Contacta al soporte.';
          break;
        case 'auth/too-many-requests':
          this.errorMessage = 'Demasiados intentos fallidos. Intenta de nuevo más tarde.';
          break;
        default:
          this.errorMessage = 'Error al iniciar sesión. Intenta de nuevo.';
          console.error('Error de Firebase en login:', error); // Para depuración
      }
    }
  }

  // Getters para acceder fácilmente a los controles del formulario desde la plantilla
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
