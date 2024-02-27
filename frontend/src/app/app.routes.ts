import { Routes } from '@angular/router';
import { PetsComponent } from './pets/pets.component';
import { OngsComponent } from './ongs/ongs.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { UsersComponent } from './users/users.component';
import { NewUserComponent } from './users/new-user/new-user.component';


export const routes: Routes = [
  { path: 'pets', component: PetsComponent},
  { path: 'ongs', component: OngsComponent},
  { path: 'users/:id', component: UsersComponent, canActivate: [AuthGuard]},
  { path: 'register', component: NewUserComponent},
  { path: 'login', component: LoginComponent},
  { path: '', component: PetsComponent},
];

