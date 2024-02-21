import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormularioPetsComponent } from './formulario/formulario-pets/formulario-pets.component';
import { FormularioOngsComponent } from './formulario/formulario-ongs/formulario-ongs.component';

@NgModule({
  declarations: [
    AdminComponent,
    FormularioPetsComponent,
    FormularioOngsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
