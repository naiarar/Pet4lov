import { PetsComponent } from './../pets/pets.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IPets } from '../pets/IPets';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    PetsComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  readonly baseUrl = 'https://angular.io/assets/images/tutorials/faa';

  pets: IPets[] = [{
    ong : 'kkkkk',
    id_animal : 9999,
    state : 'teste',
    city : 'teste',
    type : 'teste',
    name_animal : 'teste',
    color : 'teste',
    breed :  'teste',
    birth_date : 'teste',
    adoption_date : 'teste',
    health_condition : 'teste',
    vacine_status :  'teste',
    vermifugue_status :  'teste',
    observations : 'teste',
    image : 'teste',
  }]
}
