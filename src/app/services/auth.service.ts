import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  avatar: string;
  creationAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private apiUrl = 'https://api.escuelajs.co/api/v1/users';

  constructor(
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Verificar si hay una sesión activa al inicializar
    this.checkAuthStatus();
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  async register(email: string, password: string): Promise<boolean> {
    try {
      // Simulamos el registro creando un usuario local
      // En una aplicación real, esto se haría contra una API
      const newUser: User = {
        id: Date.now(),
        email,
        password,
        name: email.split('@')[0],
        role: 'customer',
        avatar: 'https://i.pravatar.cc/150?u=' + email,
        creationAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (isPlatformBrowser(this.platformId)) {
        const users = this.getStoredUsers();
        
        // Verificar si el usuario ya existe
        if (users.find(user => user.email === email)) {
          return false; // Usuario ya existe
        }

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
      }
      
      return true;
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      return false;
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      // Primero intentamos con usuarios locales
      if (isPlatformBrowser(this.platformId)) {
        const localUsers = this.getStoredUsers();
        const localUser = localUsers.find(u => u.email === email && u.password === password);
        
        if (localUser) {
          localStorage.setItem('currentUser', JSON.stringify(localUser));
          localStorage.setItem('isLoggedIn', 'true');
          
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(localUser);
          
          return true;
        }
      }

      // Si no encontramos el usuario localmente, intentamos con la API
      // Obtenemos todos los usuarios de la API
      const users = await this.http.get<User[]>(this.apiUrl).toPromise();
      const apiUser = users?.find(u => u.email === email);
      
      if (apiUser) {
        // En un escenario real, verificarías la contraseña contra la API
        // Por ahora, aceptamos cualquier contraseña para usuarios de la API
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(apiUser));
          localStorage.setItem('isLoggedIn', 'true');
        }
        
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(apiUser);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return false;
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isLoggedIn');
    }
    
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    
    this.router.navigate(['/login']);
  }

  private checkAuthStatus(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    try {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const currentUserStr = localStorage.getItem('currentUser');
      
      if (isLoggedIn && currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(currentUser);
      }
    } catch (error) {
      console.error('Error al verificar estado de autenticación:', error);
      this.logout();
    }
  }

  private getStoredUsers(): User[] {
    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }
    
    try {
      const usersStr = localStorage.getItem('users');
      return usersStr ? JSON.parse(usersStr) : [];
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return [];
    }
  }

  // Método para obtener todos los usuarios de la API
  getApiUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
}
