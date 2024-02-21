import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: { 'class': 'page' }
})
export class AppComponent {
  title = 'frontend';
  isLogged: boolean;
  private _isLoggedSubscription: any;

  constructor(private authService: AuthService) {
    this.isLogged = authService.isLoggedIn;
    this._isLoggedSubscription = authService.isLoggedInChange
      .subscribe((value) => {
        this.isLogged = value;
      });
  }

  logout() {
    this.authService.logout();
  }
}
