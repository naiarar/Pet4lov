import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => {
    if (!this.authService.isLoggedIn) {
      return this.router.createUrlTree(['/login']);
    }

    return true;
  }
}
