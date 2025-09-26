// src/app/models/character.model.ts

// Esta interfaz define la estructura de un "Character" (personaje) proveniente de la API de Rick and Morty.
// Sirve como contrato para que Angular y TypeScript sepan qué propiedades debe tener un objeto de tipo Character.
// Incluye datos básicos como nombre, especie, género, estado y ubicación, entre otros.

// Definición de la interfaz principal Character
export interface Character {
  locationName: any;   // Nombre de la ubicación actual (puede variar su tipo)
  imageLoaded: any;    // Bandera/estado que indica si la imagen ya se cargó
  notes?: string;      // Notas opcionales agregadas por el usuario
  isFavorite: any;     // Indica si el personaje está marcado como favorito
  id: number;          // ID único del personaje
  name: string;        // Nombre del personaje
  status: 'Alive' | 'Dead' | 'unknown'; // Estado del personaje: vivo, muerto o desconocido
  species: string;     // Especie del personaje
  type: string;        // Tipo o subtipo del personaje (puede estar vacío)
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown'; // Género del personaje
  origin: {            // Objeto que describe el origen del personaje
    name: string;      // Nombre del lugar de origen
    url: string;       // URL con información del origen
  };
  location: {          // Objeto que describe la ubicación actual del personaje
    name: string;      // Nombre de la ubicación actual
    url: string;       // URL con información de la ubicación
  };
  image: string;       // URL de la imagen del personaje
  episode: string[];   // Lista de episodios en los que aparece el personaje
  url: string;         // URL con la información completa del personaje
  created: string;     // Fecha en que fue creado el registro en la API
}

// Esta interfaz extiende a Character para representar un personaje guardado como favorito.
// Además de las propiedades de Character, agrega campos opcionales relacionados con la personalización del usuario.
export interface FavoriteCharacter extends Character {
  notes?: string;      // Notas personales agregadas por el usuario
  addedDate?: Date;    // Fecha en la que el personaje fue marcado como favorito
  userId?: string;     // Identificador del usuario que lo guardó (útil en apps multiusuario)
}
