import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FavoritesService } from '../../services/favorites.service';
import { Character } from '../../models/character.model';

@Component({
  selector: 'app-character-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './character-table.component.html',
  styleUrls: ['./character-table.component.css']
})
export class CharacterTableComponent implements OnInit {
  // URLs de la API
  private readonly API_URL = 'https://rickandmortyapi.com/api/character';
  private readonly API_SEARCH_URL = 'https://rickandmortyapi.com/api/character/?name=';

  // Estado del componente
  characters: Character[] = []; // Lista completa de personajes obtenidos de la API
  filteredCharacters: Character[] | null = null; // Lista filtrada, inicia en null
  sortDirection: 'asc' | 'desc' = 'asc'; // Dirección de ordenamiento
  showNotesInputId: number | null = null; // ID del personaje al que se le están editando notas
  notesText: string = ''; // Texto de las notas en edición
  searchTerm: string = ''; // Término de búsqueda
  isLoading: boolean = false; // Estado de carga
  errorMessage: string | null = null; // Mensaje de error en caso de fallo

  constructor(
    private http: HttpClient, // Para hacer peticiones HTTP
    private favoritesService: FavoritesService, // Servicio para manejar favoritos
    private cdRef: ChangeDetectorRef // Detectar cambios manualmente en la vista
  ) { }

  // Se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.loadCharacters();
  }

  // Carga inicial de personajes desde la API
  loadCharacters(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.filteredCharacters = null;

    this.http.get<{ results: Character[] }>(this.API_URL).subscribe({
      next: (response) => {
        // Enriquecer personajes con info adicional
        this.characters = response.results.map(char => ({
          ...this.enrichCharacterData(char),
          imageLoaded: false
        }));
        this.filteredCharacters = [...this.characters];
        this.isLoading = false;
        this.cdRef.detectChanges(); // Refresca la vista
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar personajes. Por favor, intenta nuevamente.';
        this.isLoading = false;
        this.filteredCharacters = [];
        this.cdRef.detectChanges();
        console.error('API Error:', err);
      }
    });
  }

  // Búsqueda de personajes por nombre
  searchCharacters(searchTerm: string): void {
    const term = searchTerm.trim();

    if (!term) {
      this.filteredCharacters = [...this.characters];
      return;
    }

    this.isLoading = true;
    this.http.get<{ results: Character[] }>(`${this.API_SEARCH_URL}${encodeURIComponent(term)}`).subscribe({
      next: (response) => {
        this.filteredCharacters = response.results.map(char => ({
          ...this.enrichCharacterData(char),
          imageLoaded: false
        }));
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.filteredCharacters = [];
        this.isLoading = false;
        this.cdRef.detectChanges();
      }
    });
  }

  // Agrega propiedades adicionales a cada personaje
  private enrichCharacterData(character: Character): Character {
    return {
      ...character,
      isFavorite: this.favoritesService.isFavorite(character.id),
      notes: this.getFavoriteNotes(character.id),
      locationName: character.location?.name || 'Desconocido'
    };
  }

  // Manejo de carga de imágenes
  handleImageLoad(character: Character): void {
    character.imageLoaded = true;
    this.cdRef.detectChanges();
  }

  // Manejo de error en imágenes (usa imagen por defecto)
  handleImageError(event: Event, character: Character): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/default-character.png';
    character.imageLoaded = true;
    this.cdRef.detectChanges();
  }

  // Alterna entre agregar o quitar un personaje de favoritos
  toggleFavorite(character: Character): void {
    if (this.favoritesService.isFavorite(character.id)) {
      this.favoritesService.removeFavorite(character.id);
    } else {
      this.favoritesService.addFavorite(character, this.notesText);
    }
    this.updateCharacterInList(character.id);
  }

  // Refresca los datos de un personaje dentro de la lista filtrada
  private updateCharacterInList(id: number): void {
    if (!this.filteredCharacters) return;

    const index = this.filteredCharacters.findIndex(c => c.id === id);
    if (index !== -1) {
      this.filteredCharacters[index] = this.enrichCharacterData(this.filteredCharacters[index]);
      this.cdRef.detectChanges();
    }
  }

  // Obtiene notas guardadas de un personaje favorito
  getFavoriteNotes(id: number): string {
    const favorite = this.favoritesService.getFavorite(id);
    return favorite?.notes || '';
  }

  // Inicia la edición de notas de un personaje
  startEditingNotes(character: Character): void {
    this.showNotesInputId = character.id;
    this.notesText = this.getFavoriteNotes(character.id);
  }

  // Guarda notas de un personaje en favoritos
  saveNotes(character: Character): void {
    if (this.notesText.trim()) {
      this.favoritesService.updateFavoriteNotes(character.id, this.notesText);
      this.updateCharacterInList(character.id);
    }
    this.cancelEditing();
  }

  // Cancela la edición de notas
  cancelEditing(): void {
    this.showNotesInputId = null;
    this.notesText = '';
  }

  // Ordena la tabla por columna
  sortTable(sortBy: keyof Character): void {
    if (!this.filteredCharacters) return;

    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

    this.filteredCharacters.sort((a, b) => {
      const aValue = a[sortBy] ?? '';
      const bValue = b[sortBy] ?? '';
      return this.sortDirection === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }

  // Carga la ubicación de un personaje al pasar el mouse
  loadLocation(character: Character): void {
    if (!character.locationName || character.locationName === 'Desconocido') {
      this.http.get<Character>(`${this.API_URL}/${character.id}`).subscribe({
        next: (data) => {
          if (this.filteredCharacters) {
            const foundChar = this.filteredCharacters.find(c => c.id === character.id);
            if (foundChar) {
              foundChar.locationName = data.location?.name || 'Desconocido';
              this.cdRef.detectChanges();
            }
          }
        }
      });
    }
  }
}
