import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [AuthService]
})
export class AppComponent {
  title = 'pet4lov';
  isLogged = false
  constructor(private route : Router,private service:AuthService) {
    this.isLogged = service.canActivate()
    service.isLoggedInChange
      .subscribe((value) => {
        this.isLogged = value
      })
  }
  logout() {
    this.service.logout()
    this.route.navigate([`/pets`]);
  }
}
