import { ApiService } from '../service/api.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-pet',
  templateUrl: './pets.component.html',
  styleUrls: ['./pets.component.css']
})
export class petsComponent {
  pets: any
  orderbyasc : boolean
  constructor(private ApiService: ApiService) {
    this.orderbyasc = true
    this.getPets()
  }

  getPets (){
    this.ApiService.pets('breed',this.orderbyasc).subscribe(result => {
      this.pets = result
    })
  }

  ordenaPets (){
    this.orderbyasc = !this.orderbyasc
    this.getPets()
  }
}


