import { AdminComponent } from './admin.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormularioPetsComponent } from './formulario/formulario-pets/formulario-pets.component';
import { FormularioOngsComponent } from './formulario/formulario-ongs/formulario-ongs.component';

const routes: Routes = [
  { path: '/pets', component: AdminComponent },
  { path:'novo-pet', component: FormularioPetsComponent},
  { path:':id-pet', component: FormularioPetsComponent},
  { path: '/ongs', component: AdminComponent },
  { path:'nova-ong', component: FormularioOngsComponent},
  { path:':id-ong', component: FormularioOngsComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
