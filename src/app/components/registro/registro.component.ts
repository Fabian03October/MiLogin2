import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="registro-container">
      <div class="registro-card">
        <h2>Crear Cuenta</h2>
        
        <form [formGroup]="registroForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Correo electrónico:</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email"
              [class.error]="registroForm.get('email')?.invalid && registroForm.get('email')?.touched"
              placeholder="ejemplo@correo.com"
            >
            <div class="error-message" *ngIf="registroForm.get('email')?.invalid && registroForm.get('email')?.touched">
              <span *ngIf="registroForm.get('email')?.errors?.['required']">El correo es requerido</span>
              <span *ngIf="registroForm.get('email')?.errors?.['email']">Ingresa un correo válido</span>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Contraseña:</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password"
              [class.error]="registroForm.get('password')?.invalid && registroForm.get('password')?.touched"
              placeholder="Mínimo 6 caracteres"
            >
            <div class="error-message" *ngIf="registroForm.get('password')?.invalid && registroForm.get('password')?.touched">
              <span *ngIf="registroForm.get('password')?.errors?.['required']">La contraseña es requerida</span>
              <span *ngIf="registroForm.get('password')?.errors?.['minlength']">La contraseña debe tener al menos 6 caracteres</span>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirmar contraseña:</label>
            <input 
              type="password" 
              id="confirmPassword" 
              formControlName="confirmPassword"
              [class.error]="registroForm.get('confirmPassword')?.invalid && registroForm.get('confirmPassword')?.touched"
              placeholder="Repite tu contraseña"
            >
            <div class="error-message" *ngIf="registroForm.get('confirmPassword')?.invalid && registroForm.get('confirmPassword')?.touched">
              <span *ngIf="registroForm.get('confirmPassword')?.errors?.['required']">Confirma tu contraseña</span>
            </div>
            <div class="error-message" *ngIf="registroForm.errors?.['passwordMismatch'] && registroForm.get('confirmPassword')?.touched">
              Las contraseñas no coinciden
            </div>
          </div>

          <div class="error-message" *ngIf="registroError">
            {{ registroError }}
          </div>

          <div class="success-message" *ngIf="registroExitoso">
            {{ registroExitoso }}
          </div>

          <button type="submit" [disabled]="registroForm.invalid || isLoading" class="registro-btn">
            {{ isLoading ? 'Creando cuenta...' : 'Crear Cuenta' }}
          </button>
        </form>

        <div class="login-link">
          <p>¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión aquí</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .registro-container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      padding: 20px;
    }

    .registro-card {
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
      border-color: #f093fb;
    }

    input.error {
      border-color: #ff4757;
    }

    .error-message {
      color: #ff4757;
      font-size: 14px;
      margin-top: 0.5rem;
    }

    .success-message {
      color: #2ed573;
      font-size: 14px;
      margin-top: 0.5rem;
      text-align: center;
      padding: 10px;
      background-color: #f0fff4;
      border-radius: 4px;
      border: 1px solid #2ed573;
    }

    .registro-btn {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s ease;
      margin-top: 1rem;
    }

    .registro-btn:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    .registro-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .login-link {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e1e1e1;
    }

    .login-link p {
      margin: 0;
      color: #666;
    }

    .login-link a {
      color: #f093fb;
      text-decoration: none;
      font-weight: 500;
    }

    .login-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegistroComponent {
  registroForm: FormGroup;
  registroError: string = '';
  registroExitoso: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      this.isLoading = true;
      this.registroError = '';
      this.registroExitoso = '';

      const { email, password } = this.registroForm.value;

      // Simular delay de registro
      setTimeout(async () => {
        const success = await this.authService.register(email, password);
        
        if (success) {
          this.registroExitoso = '¡Cuenta creada exitosamente! Redirigiendo al login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.registroError = 'Este correo ya está registrado. Intenta con otro email.';
        }
        
        this.isLoading = false;
      }, 1000);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registroForm.controls).forEach(field => {
      const control = this.registroForm.get(field);
      control?.markAsTouched();
    });
  }
}
