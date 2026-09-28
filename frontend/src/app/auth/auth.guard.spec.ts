import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { AuthService } from './auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let isLoggedIn: boolean;

  const runGuard = () => TestBed.runInInjectionContext(() =>
    authGuard({} as ActivatedRouteSnapshot, { url: '/minha-conta' } as RouterStateSnapshot)
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useValue: { isLoggedIn: () => isLoggedIn } }],
    });
  });

  it('allows access when logged in', () => {
    isLoggedIn = true;

    expect(runGuard()).toBeTrue();
  });

  it('redirects to login keeping the requested url', () => {
    isLoggedIn = false;

    const result = runGuard() as UrlTree;

    expect(TestBed.inject(Router).serializeUrl(result)).toBe('/login?returnUrl=%2Fminha-conta');
  });
});
