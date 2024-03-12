import { UsersService } from './users.service';
import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  user : any
  constructor(private service: AuthService) {
    // this.isLogged = service.canActivate()
    const me = service.getMe()
    if (me){
      me
      .add(() => {
        this.user = service.user
      })
    }

  }
  // getUsers (){
  //   this.usersService.getAll().subscribe(result => {
  //     this.users = result
  //   })
  // }
}
