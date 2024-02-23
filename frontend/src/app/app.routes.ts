import { Routes } from '@angular/router';
import { PetsComponent } from './pets/pets.component';
import { OngsComponent } from './ongs/ongs.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';


export const routes: Routes = [
  { path: 'pets', component: PetsComponent},
  { path: 'ongs', component: OngsComponent},
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent},
  // { path: , component: },
  // { path: , component: },
  // { path: , component: },
  // { path: , component: },
  // { path: , component: },
];

