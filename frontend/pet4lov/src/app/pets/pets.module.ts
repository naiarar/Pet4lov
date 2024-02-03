import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { petsComponent } from './pets.component';
import { DetalhesPetsComponent } from './detalhes-pets/detalhes-pets.component';

const routes: Routes = [
  { path: '', component: petsComponent },
  { path:':id', component: DetalhesPetsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PetsRoutingModule { }
