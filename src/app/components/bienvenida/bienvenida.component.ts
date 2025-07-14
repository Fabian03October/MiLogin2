import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PokemonListComponent } from '../pokemon-list/pokemon-list.component';

@Component({
  selector: 'app-bienvenida',
  standalone: true,
  imports: [CommonModule, PokemonListComponent],
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <header class="header">
        <div class="header-content">
          <div class="logo">
            <h1>Dashboard</h1>
          </div>
          <div class="user-menu">
            <div class="user-info" *ngIf="currentUser">
              <img [src]="currentUser.avatar" [alt]="currentUser.name" class="user-avatar">
              <span>{{ currentUser.name }}</span>
            </div>
            <button class="logout-btn" (click)="logout()">Cerrar Sesión</button>
          </div>
        </div>
      </header>

      <!-- Navigation -->
      <nav class="navigation">
        <div class="nav-content">
          <button 
            class="nav-btn"
            [class.active]="activeTab === 'perfil'"
            (click)="setActiveTab('perfil')"
          >
            <span class="nav-icon">👤</span>
            Mi Perfil
          </button>
          <button 
            class="nav-btn"
            [class.active]="activeTab === 'pokemon'"
            (click)="setActiveTab('pokemon')"
          >
            <span class="nav-icon">⚡</span>
            Pokédex
          </button>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="main-content">
        <div class="content-wrapper">
          <!-- Perfil Section -->
          <div *ngIf="activeTab === 'perfil'" class="section">
            <h2>Información del Usuario</h2>
            <div class="profile-card" *ngIf="currentUser">
              <div class="profile-header">
                <img [src]="currentUser.avatar" [alt]="currentUser.name" class="profile-avatar">
                <div class="profile-info">
                  <h3>{{ currentUser.name }}</h3>
                  <p class="profile-role">{{ currentUser.role }}</p>
                </div>
              </div>
              
              <div class="profile-details">
                <table class="user-table">
                  <tbody>
                    <tr>
                      <td class="label">ID:</td>
                      <td class="value">{{ currentUser.id }}</td>
                    </tr>
                    <tr>
                      <td class="label">Nombre:</td>
                      <td class="value">{{ currentUser.name }}</td>
                    </tr>
                    <tr>
                      <td class="label">Email:</td>
                      <td class="value">{{ currentUser.email }}</td>
                    </tr>
                    <tr>
                      <td class="label">Rol:</td>
                      <td class="value">
                        <span class="role-badge" [class]="'role-' + currentUser.role">
                          {{ currentUser.role }}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td class="label">Fecha de Creación:</td>
                      <td class="value">{{ formatDate(currentUser.creationAt) }}</td>
                    </tr>
                    <tr>
                      <td class="label">Última Actualización:</td>
                      <td class="value">{{ formatDate(currentUser.updatedAt) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Pokemon Section -->
          <div *ngIf="activeTab === 'pokemon'" class="section">
            <app-pokemon-list></app-pokemon-list>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: #f5f6fa;
    }

    .header {
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo h1 {
      margin: 0;
      color: #2c3e50;
      font-size: 1.5rem;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }

    .logout-btn {
      background: #e74c3c;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.3s;
    }

    .logout-btn:hover {
      background: #c0392b;
    }

    .navigation {
      background: white;
      border-bottom: 1px solid #e1e8ed;
    }

    .nav-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      gap: 1rem;
    }

    .nav-btn {
      background: none;
      border: none;
      padding: 1rem 1.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
      color: #6c757d;
      border-bottom: 3px solid transparent;
      transition: all 0.3s;
    }

    .nav-btn:hover {
      color: #495057;
      background: #f8f9fa;
    }

    .nav-btn.active {
      color: #007bff;
      border-bottom-color: #007bff;
    }

    .nav-icon {
      font-size: 1.2rem;
    }

    .main-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .section h2 {
      margin: 0 0 2rem 0;
      color: #2c3e50;
      font-size: 1.8rem;
    }

    .profile-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .profile-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .profile-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid rgba(255,255,255,0.3);
    }

    .profile-info h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
    }

    .profile-role {
      margin: 0;
      opacity: 0.9;
      font-size: 1rem;
    }

    .profile-details {
      padding: 2rem;
    }

    .user-table {
      width: 100%;
      border-collapse: collapse;
    }

    .user-table td {
      padding: 1rem 0;
      border-bottom: 1px solid #f1f3f4;
    }

    .user-table tr:last-child td {
      border-bottom: none;
    }

    .label {
      font-weight: 600;
      color: #495057;
      width: 200px;
    }

    .value {
      color: #6c757d;
    }

    .role-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
      text-transform: capitalize;
    }

    .role-admin {
      background: #dc3545;
      color: white;
    }

    .role-customer {
      background: #28a745;
      color: white;
    }

    .role-user {
      background: #007bff;
      color: white;
    }

    @media (max-width: 768px) {
      .header-content {
        padding: 1rem;
        flex-direction: column;
        gap: 1rem;
      }

      .nav-content {
        padding: 0 1rem;
        flex-direction: column;
      }

      .nav-btn {
        padding: 0.75rem 1rem;
        border-bottom: none;
        border-left: 3px solid transparent;
      }

      .nav-btn.active {
        border-left-color: #007bff;
        border-bottom-color: transparent;
      }

      .main-content {
        padding: 1rem;
      }

      .profile-header {
        flex-direction: column;
        text-align: center;
      }

      .label {
        width: auto;
        display: block;
        margin-bottom: 0.25rem;
      }

      .user-table td {
        display: block;
        padding: 0.5rem 0;
      }
    }
  `]
})
export class BienvenidaComponent implements OnInit {
  currentUser: User | null = null;
  activeTab: string = 'perfil';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
