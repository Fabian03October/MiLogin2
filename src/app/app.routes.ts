import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { BienvenidaComponent } from './components/bienvenida/bienvenida.component';
import { authGuard, loginGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [loginGuard]
  },
  { 
    path: 'registro', 
    component: RegistroComponent,
    canActivate: [loginGuard]
  },
  { 
    path: 'bienvenida', 
    component: BienvenidaComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/login' }
];
