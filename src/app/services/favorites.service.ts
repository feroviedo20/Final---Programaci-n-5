// src/app/services/favorites.service.ts

// Importaciones necesarias de Angular y RxJS
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Character } from '../models/character.model';

// Interface que extiende de Character y agrega propiedades opcionales
export interface FavoriteCharacter extends Character {
  id: any;        // Identificador único del personaje
  species: any;   // Especie del personaje
  status: any;    // Estado (vivo, muerto, desconocido)
  name: any;      // Nombre del personaje
  image: any;     // URL de la imagen
  notes?: string; // Notas opcionales agregadas por el usuario
  addedDate?: Date; // Fecha en que se agregó a favoritos
}

// Decorador que indica que este servicio puede inyectarse en toda la app
@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  // Clave usada para guardar los favoritos en localStorage
  private readonly STORAGE_KEY = 'rickAndMortyFavorites';

  // BehaviorSubject: almacena y emite la lista de favoritos en tiempo real
  private favoritesSubject: BehaviorSubject<FavoriteCharacter[]>;

  constructor() {
    // Al iniciar, se cargan los favoritos guardados en localStorage
    const savedFavorites = this.getFromLocalStorage();
    this.favoritesSubject = new BehaviorSubject<FavoriteCharacter[]>(savedFavorites);
  }

  // Devuelve los favoritos como un observable (para que los componentes se suscriban)
  getFavorites(): Observable<FavoriteCharacter[]> {
    return this.favoritesSubject.asObservable();
  }

  // Agrega un personaje a la lista de favoritos
  addFavorite(character: Character, notes?: string): void {
    const currentFavorites = this.favoritesSubject.value;

    // Si ya está en favoritos, no lo vuelve a agregar
    if (this.isFavorite(character.id)) {
      return;
    }

    // Se crea un nuevo objeto de favorito con notas y fecha de agregado
    const newFavorite: FavoriteCharacter = {
      ...character,
      notes: notes || '',
      addedDate: new Date()
    };

    // Se actualiza la lista con el nuevo favorito
    const updatedFavorites = [...currentFavorites, newFavorite];

    // Se guardan los cambios en localStorage
    this.saveToLocalStorage(updatedFavorites);

    // Se emite la nueva lista a todos los que estén suscritos
    this.favoritesSubject.next(updatedFavorites);
  }

  // Elimina un favorito de la lista según su ID
  removeFavorite(id: number): void {
    const updatedFavorites = this.favoritesSubject.value.filter(
      favorite => favorite.id !== id
    );

    this.saveToLocalStorage(updatedFavorites);
    this.favoritesSubject.next(updatedFavorites);
  }

  // Permite actualizar las notas de un personaje favorito
  updateFavoriteNotes(id: number, notes: string): void {
    const updatedFavorites = this.favoritesSubject.value.map(favorite => {
      if (favorite.id === id) {
        return { ...favorite, notes }; // Se reemplaza solo la propiedad "notes"
      }
      return favorite;
    });

    this.saveToLocalStorage(updatedFavorites);
    this.favoritesSubject.next(updatedFavorites);
  }

  // Verifica si un personaje ya está en favoritos
  isFavorite(id: number): boolean {
    return this.favoritesSubject.value.some(favorite => favorite.id === id);
  }

  // Devuelve un personaje favorito por su ID (o undefined si no existe)
  getFavorite(id: number): FavoriteCharacter | undefined {
    return this.favoritesSubject.value.find(favorite => favorite.id === id);
  }

  // Método privado: guarda la lista de favoritos en localStorage
  private saveToLocalStorage(favorites: FavoriteCharacter[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage', error);
    }
  }

  // Método privado: recupera la lista de favoritos desde localStorage
  private getFromLocalStorage(): FavoriteCharacter[] {
    try {
      const favoritesJson = localStorage.getItem(this.STORAGE_KEY);
      return favoritesJson ? JSON.parse(favoritesJson) : [];
    } catch (error) {
      console.error('Error reading favorites from localStorage', error);
      return [];
    }
  }
}
