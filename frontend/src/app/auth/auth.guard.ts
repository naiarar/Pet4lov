import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";
import { inject } from "@angular/core";

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) => {
    const canAcess = inject(AuthService).canActivate()
    const router: Router = inject(Router);
      return (!canAcess)?router.createUrlTree(['/login']):canAcess

}
