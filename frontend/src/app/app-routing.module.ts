import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from './auth/auth.guard';



const routes: Routes = [
  { path: 'login', component: LoginComponent},
  // { path: 'catalogo', loadChildren: () => import('./catalogo/catalogo.module').then(m => m.CatalogoModule) },
  { path: 'admin', loadChildren: () => import('../app/admin/admin.module').then(m => m.AdminModule), canActivate: [AuthGuard] },
  { path: '', redirectTo: "index", pathMatch: "full"},
  // { path: 'contato', loadChildren: () => import('./contato/contato.module').then(m => m.ContatoModule) },
  // { path:'**', component:NaoEncontradaComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
