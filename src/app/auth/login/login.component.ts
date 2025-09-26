// src/app/login/login.component.ts

// Este componente maneja el inicio de sesión de usuarios.
// - Muestra un formulario con email y contraseña.
// - Valida los datos ingresados.
// - Usa AuthService para autenticar contra Firebase u otro backend.
// - Si el login es exitoso, redirige al usuario a la página principal.
// - Si falla, muestra un mensaje de error en pantalla.

// Importaciones necesarias desde Angular y librerías asociadas
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service'; // Servicio de autenticación personalizado (revisa que la ruta sea correcta)
import { CommonModule } from '@angular/common'; // Necesario para directivas estructurales como *ngIf

// Decorador que define el componente Angular
@Component({
  selector: 'app-login', // Nombre de la etiqueta HTML que representará este componente
  standalone: true,      // Se indica que el componente es standalone (no depende de un módulo)
  imports: [             // Módulos que el componente necesita
    CommonModule,        // Permite usar directivas de Angular como *ngIf, *ngFor, etc.
    ReactiveFormsModule, // Habilita el uso de formularios reactivos
    RouterModule         // Permite navegación con routerLink y redirecciones programáticas
  ],
  templateUrl: './login.component.html',  // Plantilla HTML asociada
  styleUrls: ['./login.component.css']    // Estilos CSS específicos del componente
})
export class LoginComponent implements OnInit {
  // ---------------------------
  // PROPIEDADES DE LA CLASE
  // ---------------------------
  loginForm: FormGroup;               // Formulario reactivo que manejará email y password
  errorMessage: string | null = null; // Variable para mostrar errores en pantalla (Firebase o validación)

  // ---------------------------
  // CONSTRUCTOR
  // ---------------------------
  constructor(
    private fb: FormBuilder,       // Servicio de Angular para construir formularios reactivos
    private authService: AuthService, // Servicio de autenticación (encapsula lógica de Firebase u otro backend)
    private router: Router         // Servicio de Angular para redirigir entre rutas
  ) {
    // Verificar si ya hay un usuario autenticado
    // En caso afirmativo, redirigir a la página principal
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }

    // Inicialización del formulario reactivo con dos campos:
    // - email: obligatorio y con formato de email
    // - password: obligatorio
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // ---------------------------
  // CICLO DE VIDA
  // ---------------------------
  ngOnInit(): void {
    // Hook que se ejecuta cuando el componente se inicializa.
    // Ideal para lógica de preparación (aunque aquí no se usa nada por ahora).
  }

  // ---------------------------
  // MÉTODO PRINCIPAL: onSubmit
  // ---------------------------
  async onSubmit() {
    // Reiniciar cualquier mensaje de error previo
    this.errorMessage = null;

    // Verificar que el formulario sea válido antes de continuar
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor ingresa un email y contraseña válidos.';
      return; // Detener ejecución si el formulario es inválido
    }

    // Obtener las credenciales desde el formulario
    const { email, password } = this.loginForm.value;

    try {
      // Intentar autenticar con el servicio AuthService
      await this.authService.login(email, password);

      // Si la autenticación es exitosa, el estado ya está actualizado en AuthService.
      // Aquí redirigimos al usuario a la página principal.
      this.router.navigate(['/']);
    } catch (error: any) {
      // Manejo de errores según los códigos de Firebase Authentication
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
          console.error('Error de Firebase en login:', error); // Log de depuración en consola
      }
    }
  }

  // ---------------------------
  // GETTERS
  // ---------------------------
  // Estos métodos permiten acceder fácilmente a los controles del formulario
  // desde la plantilla HTML (por ejemplo: email?.errors, password?.touched).
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
