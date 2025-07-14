import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService, Pokemon, PokemonType } from '../../services/pokemon.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pokemon-container">
      <div class="pokemon-header">
        <h2>Pokédex</h2>
        <p>Explora el mundo Pokémon organizado por tipos</p>
      </div>

      <!-- Loading -->
      <div *ngIf="isLoading" class="loading">
        <div class="spinner"></div>
        <p>Cargando Pokémon...</p>
      </div>

      <!-- Type Filter -->
      <div *ngIf="!isLoading" class="type-filter">
        <button 
          class="type-btn"
          [class.active]="selectedType === 'all'"
          (click)="selectType('all')"
        >
          Todos
        </button>
        <button 
          *ngFor="let type of pokemonTypes" 
          class="type-btn"
          [class.active]="selectedType === type.name"
          [style.background-color]="pokemonService.getTypeColor(type.name)"
          (click)="selectType(type.name)"
        >
          {{ type.name | titlecase }}
        </button>
      </div>

      <!-- Pokemon Table -->
      <div *ngIf="!isLoading" class="pokemon-table-container">
        <table class="pokemon-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Tipos</th>
              <th>Altura</th>
              <th>Peso</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              *ngFor="let pokemon of filteredPokemon" 
              class="pokemon-row"
              [class.selected]="selectedPokemonId === pokemon.id"
            >
              <td class="pokemon-id">#{{ pokemon.id.toString().padStart(3, '0') }}</td>
              <td class="pokemon-image-cell">
                <img 
                  [src]="pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default" 
                  [alt]="pokemon.name"
                  loading="lazy"
                  class="pokemon-table-image"
                >
              </td>
              <td class="pokemon-name">{{ pokemon.name | titlecase }}</td>
              <td class="pokemon-types-cell">
                <span 
                  *ngFor="let type of pokemon.types" 
                  class="type-badge small"
                  [style.background-color]="pokemonService.getTypeColor(type.type.name)"
                >
                  {{ type.type.name }}
                </span>
              </td>
              <td class="pokemon-stat">{{ pokemon.height / 10 }} m</td>
              <td class="pokemon-stat">{{ pokemon.weight / 10 }} kg</td>
              <td class="pokemon-actions">
                <button 
                  class="details-btn"
                  (click)="selectPokemon(pokemon)"
                >
                  Ver Detalles
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pokemon Detail Modal -->
      <div *ngIf="selectedPokemonDetail" class="modal-overlay" (click)="closeModal()">
        <div class="pokemon-detail" (click)="$event.stopPropagation()">
          <button class="close-btn" (click)="closeModal()">×</button>
          
          <div class="detail-header">
            <img 
              [src]="selectedPokemonDetail.sprites.other['official-artwork'].front_default" 
              [alt]="selectedPokemonDetail.name"
            >
            <div class="detail-info">
              <h2>#{{ selectedPokemonDetail.id.toString().padStart(3, '0') }} {{ selectedPokemonDetail.name | titlecase }}</h2>
              <div class="pokemon-types">
                <span 
                  *ngFor="let type of selectedPokemonDetail.types" 
                  class="type-badge large"
                  [style.background-color]="pokemonService.getTypeColor(type.type.name)"
                >
                  {{ type.type.name }}
                </span>
              </div>
            </div>
          </div>

          <div class="detail-content">
            <div class="detail-section">
              <h3>Información Básica</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">Altura:</span>
                  <span class="value">{{ selectedPokemonDetail.height / 10 }} m</span>
                </div>
                <div class="info-item">
                  <span class="label">Peso:</span>
                  <span class="value">{{ selectedPokemonDetail.weight / 10 }} kg</span>
                </div>
                <div class="info-item">
                  <span class="label">Experiencia Base:</span>
                  <span class="value">{{ selectedPokemonDetail.base_experience }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h3>Estadísticas</h3>
              <div class="stats-grid">
                <div *ngFor="let stat of selectedPokemonDetail.stats" class="stat-item">
                  <span class="stat-name">{{ getStatName(stat.stat.name) }}</span>
                  <div class="stat-bar">
                    <div 
                      class="stat-fill" 
                      [style.width.%]="(stat.base_stat / 255) * 100"
                      [style.background-color]="getStatColor(stat.base_stat)"
                    ></div>
                  </div>
                  <span class="stat-value">{{ stat.base_stat }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h3>Habilidades</h3>
              <div class="abilities">
                <span 
                  *ngFor="let ability of selectedPokemonDetail.abilities" 
                  class="ability-badge"
                  [class.hidden]="ability.is_hidden"
                >
                  {{ ability.ability.name | titlecase }}
                  <small *ngIf="ability.is_hidden"> (Oculta)</small>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pokemon-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .pokemon-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .pokemon-header h2 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
      font-size: 2.5rem;
    }

    .pokemon-header p {
      margin: 0;
      color: #6c757d;
      font-size: 1.1rem;
    }

    .loading {
      text-align: center;
      padding: 4rem 2rem;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .type-filter {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 2rem;
      justify-content: center;
    }

    .type-btn {
      background: #6c757d;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
      text-transform: capitalize;
    }

    .type-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .type-btn.active {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      border: 2px solid white;
    }

    .pokemon-table-container {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      margin: 1rem 0;
    }

    .pokemon-table {
      width: 100%;
      border-collapse: collapse;
    }

    .pokemon-table th {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .pokemon-table th:first-child {
      text-align: center;
    }

    .pokemon-row {
      border-bottom: 1px solid #e9ecef;
      transition: all 0.3s;
    }

    .pokemon-row:hover {
      background-color: #f8f9fa;
    }

    .pokemon-row.selected {
      background-color: #e3f2fd;
      border-left: 4px solid #2196f3;
    }

    .pokemon-table td {
      padding: 1rem;
      vertical-align: middle;
    }

    .pokemon-id {
      text-align: center;
      font-weight: 600;
      color: #6c757d;
      font-family: monospace;
    }

    .pokemon-image-cell {
      text-align: center;
      width: 80px;
    }

    .pokemon-table-image {
      width: 60px;
      height: 60px;
      object-fit: contain;
      border-radius: 8px;
    }

    .pokemon-name {
      font-weight: 600;
      color: #2c3e50;
      font-size: 1.1rem;
    }

    .pokemon-types-cell {
      min-width: 150px;
    }

    .pokemon-stat {
      color: #6c757d;
      font-weight: 500;
    }

    .pokemon-actions {
      text-align: center;
    }

    .details-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
    }

    .details-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .pokemon-types {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .type-badge {
      background: #6c757d;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: capitalize;
      margin-right: 0.25rem;
      margin-bottom: 0.25rem;
      display: inline-block;
    }

    .type-badge.small {
      padding: 0.2rem 0.6rem;
      font-size: 0.7rem;
      border-radius: 10px;
    }

    .type-badge.large {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 2rem;
    }

    .pokemon-detail {
      background: white;
      border-radius: 20px;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      width: 100%;
    }

    .close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: #e74c3c;
      color: white;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 1.5rem;
      cursor: pointer;
      z-index: 10;
    }

    .detail-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      text-align: center;
    }

    .detail-header img {
      width: 150px;
      height: 150px;
      object-fit: contain;
      margin-bottom: 1rem;
    }

    .detail-header h2 {
      margin: 0 0 1rem 0;
      font-size: 1.8rem;
    }

    .detail-content {
      padding: 2rem;
    }

    .detail-section {
      margin-bottom: 2rem;
    }

    .detail-section h3 {
      margin: 0 0 1rem 0;
      color: #2c3e50;
      font-size: 1.3rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .label {
      font-weight: 600;
      color: #495057;
    }

    .value {
      color: #6c757d;
    }

    .stats-grid {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .stat-item {
      display: grid;
      grid-template-columns: 1fr 2fr auto;
      gap: 1rem;
      align-items: center;
    }

    .stat-name {
      font-weight: 600;
      color: #495057;
      text-transform: capitalize;
    }

    .stat-bar {
      height: 8px;
      background: #e9ecef;
      border-radius: 4px;
      overflow: hidden;
    }

    .stat-fill {
      height: 100%;
      transition: width 0.3s ease;
    }

    .stat-value {
      font-weight: 600;
      color: #495057;
      min-width: 30px;
      text-align: right;
    }

    .abilities {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .ability-badge {
      background: #17a2b8;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 500;
    }

    .ability-badge.hidden {
      background: #6f42c1;
    }

    @media (max-width: 768px) {
      .pokemon-table-container {
        overflow-x: auto;
      }

      .pokemon-table {
        min-width: 700px;
      }

      .pokemon-table th,
      .pokemon-table td {
        padding: 0.75rem 0.5rem;
      }

      .pokemon-table-image {
        width: 50px;
        height: 50px;
      }

      .pokemon-name {
        font-size: 1rem;
      }

      .type-badge.small {
        padding: 0.15rem 0.5rem;
        font-size: 0.6rem;
      }

      .modal-overlay {
        padding: 1rem;
      }

      .detail-content {
        padding: 1rem;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .stat-item {
        grid-template-columns: 1fr 1.5fr auto;
        gap: 0.5rem;
      }
    }

      .stat-item {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }
    }
  `]
})
export class PokemonListComponent implements OnInit {
  pokemonList: Pokemon[] = [];
  filteredPokemon: Pokemon[] = [];
  pokemonTypes: any[] = [];
  selectedType: string = 'all';
  selectedPokemonId: number | null = null;
  selectedPokemonDetail: Pokemon | null = null;
  isLoading: boolean = true;

  constructor(public pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  async loadInitialData(): Promise<void> {
    try {
      this.isLoading = true;
      
      // Cargar los primeros 151 Pokémon (Kanto)
      const pokemonPromises: Promise<Pokemon>[] = [];
      for (let i = 1; i <= 151; i++) {
        pokemonPromises.push(this.pokemonService.getPokemon(i).toPromise() as Promise<Pokemon>);
      }

      // Cargar tipos
      const typesResponse = await this.pokemonService.getAllTypes().toPromise();
      this.pokemonTypes = typesResponse?.results?.slice(0, 18) || []; // Los primeros 18 tipos

      // Esperar a que se carguen todos los Pokémon
      this.pokemonList = await Promise.all(pokemonPromises);
      this.filteredPokemon = this.pokemonList;
      
      this.isLoading = false;
    } catch (error) {
      console.error('Error loading Pokemon data:', error);
      this.isLoading = false;
    }
  }

  selectType(type: string): void {
    this.selectedType = type;
    
    if (type === 'all') {
      this.filteredPokemon = this.pokemonList;
    } else {
      this.filteredPokemon = this.pokemonList.filter(pokemon =>
        pokemon.types.some(t => t.type.name === type)
      );
    }
  }

  selectPokemon(pokemon: Pokemon): void {
    this.selectedPokemonId = pokemon.id;
    this.selectedPokemonDetail = pokemon;
  }

  closeModal(): void {
    this.selectedPokemonDetail = null;
    this.selectedPokemonId = null;
  }

  getStatName(statName: string): string {
    const statNames: { [key: string]: string } = {
      'hp': 'PS',
      'attack': 'Ataque',
      'defense': 'Defensa',
      'special-attack': 'Ataque Esp.',
      'special-defense': 'Defensa Esp.',
      'speed': 'Velocidad'
    };
    return statNames[statName] || statName;
  }

  getStatColor(statValue: number): string {
    if (statValue >= 120) return '#e74c3c';
    if (statValue >= 80) return '#f39c12';
    if (statValue >= 50) return '#f1c40f';
    return '#95a5a6';
  }
}
