// src/app/components/favorites-list/favorites-list.component.ts

// Importaciones necesarias de Angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FavoritesService } from '../../services/favorites.service';
import { RouterModule } from '@angular/router';

// Decorador @Component que define el componente
@Component({
  selector: 'app-favorites-list',                 // Nombre de la etiqueta que representa el componente
  standalone: true,                               // Este componente es independiente (no requiere un módulo específico)
  imports: [CommonModule, FormsModule, RouterModule], // Módulos que el componente necesita para funcionar
  templateUrl: './favorites-list.component.html', // Archivo de plantilla HTML asociado
  styleUrls: ['./favorites-list.component.css']   // Archivo(s) de estilos asociados
})
export class FavoritesListComponent {
  // Identificador del personaje que está en modo edición de notas
  editingNotesId: number | null = null;

  // Contenido temporal de las notas mientras se editan
  updatedNotes: string = '';

  // Inyección del servicio de favoritos (se marca como público para poder usarlo directamente en la plantilla)
  constructor(public favoritesService: FavoritesService) { }

  /**
   * Activa el modo de edición para un personaje favorito específico.
   * - Guarda el ID del personaje que se está editando.
   * - Carga las notas existentes en el campo temporal (updatedNotes).
   */
  startEditing(favorite: any): void {
    this.editingNotesId = favorite.id;
    this.updatedNotes = favorite.notes || '';
  }

  /**
   * Guarda las notas editadas de un personaje favorito.
   * - Si el texto no está vacío, llama al servicio para actualizarlo.
   * - Luego cierra el modo de edición.
   */
  saveNotes(favorite: any): void {
    if (this.updatedNotes.trim()) {
      this.favoritesService.updateFavoriteNotes(favorite.id, this.updatedNotes);
    }
    this.editingNotesId = null;
  }

  /**
   * Cancela la edición de notas.
   * - Limpia el ID de edición para cerrar el formulario.
   */
  cancelEditing(): void {
    this.editingNotesId = null;
  }
}
