import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Iniciar Sesión</h2>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Correo electrónico:</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email"
              [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
              placeholder="ejemplo@correo.com"
            >
            <div class="error-message" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
              <span *ngIf="loginForm.get('email')?.errors?.['required']">El correo es requerido</span>
              <span *ngIf="loginForm.get('email')?.errors?.['email']">Ingresa un correo válido</span>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Contraseña:</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password"
              [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
              placeholder="Tu contraseña"
            >
            <div class="error-message" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              <span *ngIf="loginForm.get('password')?.errors?.['required']">La contraseña es requerida</span>
              <span *ngIf="loginForm.get('password')?.errors?.['minlength']">La contraseña debe tener al menos 5 caracteres</span>
            </div>
          </div>

          <div class="error-message" *ngIf="loginError">
            {{ loginError }}
          </div>

          <button type="submit" [disabled]="loginForm.invalid || isLoading" class="login-btn">
            {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </form>

        <div class="register-link">
          <p>¿No tienes cuenta? <a routerLink="/registro">Regístrate aquí</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    h2 {
      text-align: center;
      margin-bottom: 1.5rem;
      color: #333;
      font-weight: 600;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 12px;
      border: 2px solid #e1e1e1;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s ease;
      box-sizing: border-box;
    }

    input:focus {
      outline: none;
      border-color: #667eea;
    }

    input.error {
      border-color: #ff4757;
    }

    .error-message {
      color: #ff4757;
      font-size: 14px;
      margin-top: 0.5rem;
    }

    .login-btn {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s ease;
      margin-top: 1rem;
    }

    .login-btn:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    .login-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .register-link {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e1e1e1;
    }

    .register-link p {
      margin: 0;
      color: #666;
    }

    .register-link a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .register-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginError = '';

      const { email, password } = this.loginForm.value;

      // Simular delay de autenticación
      setTimeout(async () => {
        const success = await this.authService.login(email, password);
        
        if (success) {
          this.router.navigate(['/bienvenida']);
        } else {
          this.loginError = 'Credenciales incorrectas. Verifica tu email y contraseña.';
        }
        
        this.isLoading = false;
      }, 1000);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(field => {
      const control = this.loginForm.get(field);
      control?.markAsTouched();
    });
  }
}
