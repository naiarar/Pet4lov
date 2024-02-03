import { DetalhesOngsComponent } from './detalhes-ongs/detalhes-ongs.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OngsComponent } from './ongs.component';

const routes: Routes = [
  { path: '', component: OngsComponent },
  { path:':id', component: DetalhesOngsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OngsRoutingModule { }
