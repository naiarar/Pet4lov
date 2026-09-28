import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  isLoggedIn$ = this.auth.isLoggedIn$;
  year = new Date().getFullYear();
  menuOpen = false;

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd), takeUntilDestroyed())
      .subscribe(() => this.menuOpen = false);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/pets']);
  }
}
