import { PetsComponent } from './../pets/pets.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './../home/home.component';



const routeConfig: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home page'
  },
  {
    path: 'details/:id',
    component: PetsComponent,
    title: 'Pets'
  }
];

export default routeConfig;
