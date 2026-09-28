import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'pets' },
  { path: 'pets', title: 'Pets para adoção | Pet4lov', loadComponent: () => import('./pets/pet-list.component').then(m => m.PetListComponent) },
  { path: 'pets/novo', title: 'Cadastrar pet | Pet4lov', canActivate: [authGuard], loadComponent: () => import('./pets/pet-form.component').then(m => m.PetFormComponent) },
  { path: 'pets/:id/editar', title: 'Editar pet | Pet4lov', canActivate: [authGuard], loadComponent: () => import('./pets/pet-form.component').then(m => m.PetFormComponent) },
  { path: 'pets/:id', title: 'Pet | Pet4lov', loadComponent: () => import('./pets/pet-detail.component').then(m => m.PetDetailComponent) },
  { path: 'ongs', title: 'ONGs parceiras | Pet4lov', loadComponent: () => import('./ongs/ong-list.component').then(m => m.OngListComponent) },
  { path: 'ongs/nova', title: 'Cadastrar ONG | Pet4lov', canActivate: [authGuard], loadComponent: () => import('./ongs/ong-form.component').then(m => m.OngFormComponent) },
  { path: 'ongs/:id/editar', title: 'Editar ONG | Pet4lov', canActivate: [authGuard], loadComponent: () => import('./ongs/ong-form.component').then(m => m.OngFormComponent) },
  { path: 'minha-conta', title: 'Minha conta | Pet4lov', canActivate: [authGuard], loadComponent: () => import('./users/account.component').then(m => m.AccountComponent) },
  { path: 'cadastro', title: 'Criar conta | Pet4lov', loadComponent: () => import('./users/register.component').then(m => m.RegisterComponent) },
  { path: 'login', title: 'Entrar | Pet4lov', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: '**', redirectTo: 'pets' },
];
