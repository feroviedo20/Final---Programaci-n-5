import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Auth,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  authState
} from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { switchMap, tap } from 'rxjs/operators';

// Interfaz que representa al usuario de la aplicación
export interface AppUser {
  uid: string;              // Identificador único en Firebase
  email: string | null;     // Email del usuario
  username?: string | null; // Nombre de usuario (opcional)
  createdAt?: Date;         // Fecha de creación del perfil
}

@Injectable({
  providedIn: 'root' // Disponible en toda la aplicación sin necesidad de declararlo en un módulo
})
export class AuthService {
  // BehaviorSubject guarda el estado actual del usuario y permite suscribirse a cambios
  private currentUserSubject = new BehaviorSubject<AppUser | null>(null);

  // Observable que expone el usuario actual a toda la aplicación
  public currentUser: Observable<AppUser | null> = this.currentUserSubject.asObservable();

  constructor(
    private router: Router,
    private auth: Auth,         // Servicio de autenticación de Firebase
    private firestore: Firestore // Firestore para manejar datos adicionales del usuario
  ) {
    // Escucha cambios de estado en Firebase Authentication (login/logout)
    authState(this.auth).pipe(
      // Cuando cambia el estado de auth, obtenemos o creamos el perfil en Firestore
      switchMap(async (user: FirebaseUser | null): Promise<AppUser | null> => {
        if (!user) {
          // Si no hay usuario logueado, devolvemos null
          return null;
        }

        // Intentamos obtener el perfil guardado en Firestore
        const userProfileData = await this.getUserProfile(user.uid);

        if (!userProfileData) {
          // Si no existe perfil, creamos uno inicial
          const initialUsername = user.displayName || user.email?.split('@')[0] || 'Nuevo Usuario';

          // Delay pequeño para evitar problemas de sincronización
          await new Promise(resolve => setTimeout(resolve, 500));

          // Guardamos perfil en Firestore
          await this._createInitialUserProfile(user.uid, initialUsername, user.email || '');

          // Volvemos a obtener el perfil ya creado
          const newlyCreatedProfileData = await this.getUserProfile(user.uid);

          return {
            uid: user.uid,
            email: user.email,
            username: newlyCreatedProfileData?.username || initialUsername,
            createdAt: newlyCreatedProfileData?.createdAt
          } as AppUser;
        } else {
          // Si el perfil ya existe en Firestore, lo devolvemos
          return {
            uid: user.uid,
            email: user.email,
            username: userProfileData?.username || user.displayName || null,
            createdAt: userProfileData?.createdAt
          } as AppUser;
        }
      }),
      // Actualizamos el estado global del usuario
      tap((appUser: AppUser | null) => {
        this.currentUserSubject.next(appUser);
      })
    ).subscribe(); // Nos suscribimos para mantener actualizado el estado
  }

  // Getter para acceder al usuario actual de forma síncrona
  public get currentUserValue(): AppUser | null {
    return this.currentUserSubject.value;
  }

  // Crea un perfil inicial en Firestore cuando un usuario se registra
  private async _createInitialUserProfile(uid: string, username: string, email: string): Promise<void> {
    const userDocRef = doc(this.firestore, 'users', uid);
    try {
      await setDoc(userDocRef, {
        username: username,
        email: email,
        createdAt: new Date()
      }, { merge: true });
    } catch (error) {
      throw error;
    }
  }

  // Permite actualizar datos del perfil del usuario existente en Firestore
  public async updateExistingUserProfile(uid: string, dataToUpdate: Partial<AppUser>): Promise<void> {
    const userDocRef = doc(this.firestore, 'users', uid);
    try {
      await setDoc(userDocRef, dataToUpdate, { merge: true });
    } catch (error) {
      throw error;
    }
  }

  // Obtiene los datos del perfil de usuario desde Firestore
  private async getUserProfile(uid: string): Promise<{ username?: string | null; createdAt?: Date } | null> {
    const userDocRef = doc(this.firestore, 'users', uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        username: data['username'] || null,
        createdAt: data['createdAt'] ? (data['createdAt'] as any).toDate() : undefined,
      };
    }
    return null;
  }

  // Registro de usuario con email, contraseña y nombre de usuario
  async register(email: string, password: string, username: string): Promise<boolean> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      if (user) {
        // Guardamos el username en Firebase Authentication
        await updateProfile(user, { displayName: username });

        // Cerramos la sesión para forzar un login después
        await signOut(this.auth);

        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      throw error;
    }
  }

  // Login con email y contraseña
  async login(email: string, password: string): Promise<boolean> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      return true;
    } catch (error: any) {
      throw error;
    }
  }

  // Logout del usuario y redirección a la página de login
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error: any) {
      throw error;
    }
  }
}
