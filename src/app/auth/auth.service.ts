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

export interface AppUser {
  uid: string;
  email: string | null;
  username?: string | null;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AppUser | null>(null);
  public currentUser: Observable<AppUser | null> = this.currentUserSubject.asObservable();

  constructor(
    private router: Router,
    private auth: Auth,
    private firestore: Firestore
  ) {
    authState(this.auth).pipe(
      switchMap(async (user: FirebaseUser | null): Promise<AppUser | null> => {
        if (!user) {
          return null;
        }

        const userProfileData = await this.getUserProfile(user.uid);

        if (!userProfileData) {
          const initialUsername = user.displayName || user.email?.split('@')[0] || 'Nuevo Usuario';
          await new Promise(resolve => setTimeout(resolve, 500));
          await this._createInitialUserProfile(user.uid, initialUsername, user.email || '');
          const newlyCreatedProfileData = await this.getUserProfile(user.uid);
          return {
            uid: user.uid,
            email: user.email,
            username: newlyCreatedProfileData?.username || initialUsername,
            createdAt: newlyCreatedProfileData?.createdAt
          } as AppUser;
        } else {
          return {
            uid: user.uid,
            email: user.email,
            username: userProfileData?.username || user.displayName || null,
            createdAt: userProfileData?.createdAt
          } as AppUser;
        }
      }),
      tap((appUser: AppUser | null) => {
        this.currentUserSubject.next(appUser);
      })
    ).subscribe();
  }

  public get currentUserValue(): AppUser | null {
    return this.currentUserSubject.value;
  }

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

  public async updateExistingUserProfile(uid: string, dataToUpdate: Partial<AppUser>): Promise<void> {
    const userDocRef = doc(this.firestore, 'users', uid);
    try {
      await setDoc(userDocRef, dataToUpdate, { merge: true });
    } catch (error) {
      throw error;
    }
  }

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

  async register(email: string, password: string, username: string): Promise<boolean> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      if (user) {
        await updateProfile(user, { displayName: username });
        await signOut(this.auth);
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      throw error;
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      return true;
    } catch (error: any) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error: any) {
      throw error;
    }
  }
}