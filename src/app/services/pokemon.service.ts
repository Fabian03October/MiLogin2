import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: {
    front_default: string;
    back_default: string;
    front_shiny: string;
    back_shiny: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
      dream_world: {
        front_default: string;
      };
    };
  };
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }>;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

export interface PokemonType {
  id: number;
  name: string;
  pokemon: Array<{
    pokemon: {
      name: string;
      url: string;
    };
    slot: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  // Obtener un Pokémon específico por nombre o ID
  getPokemon(nameOrId: string | number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.baseUrl}/pokemon/${nameOrId}`);
  }

  // Obtener lista de Pokémon con paginación
  getPokemonList(limit: number = 20, offset: number = 0): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(`${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`);
  }

  // Obtener información de un tipo específico
  getPokemonType(typeId: number | string): Observable<PokemonType> {
    return this.http.get<PokemonType>(`${this.baseUrl}/type/${typeId}`);
  }

  // Obtener todos los tipos de Pokémon
  getAllTypes(): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(`${this.baseUrl}/type`);
  }

  // Obtener Pokémon por tipo
  getPokemonByType(typeName: string): Observable<PokemonType> {
    return this.http.get<PokemonType>(`${this.baseUrl}/type/${typeName}`);
  }

  // Extraer ID del Pokémon desde la URL
  extractPokemonId(url: string): number {
    const parts = url.split('/');
    return parseInt(parts[parts.length - 2]);
  }

  // Obtener color del tipo para las tarjetas
  getTypeColor(type: string): string {
    const typeColors: { [key: string]: string } = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    };
    return typeColors[type] || '#68A090';
  }
}
