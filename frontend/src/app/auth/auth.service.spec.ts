import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { clearCookies, fakeJwt } from '../testing/fake-jwt';
import { AuthService, tokenExpiration } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    clearCookies();
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    clearCookies();
  });

  it('stores tokens and notifies subscribers on login', () => {
    const states: boolean[] = [];
    service.isLoggedIn$.subscribe(state => states.push(state));
    const access = fakeJwt(1800);

    service.login('ana@pet4lov.com', 'senha').subscribe();
    const req = http.expectOne(`${environment.apiUrl}/auth/obtain/`);
    expect(req.request.body).toEqual({ email: 'ana@pet4lov.com', password: 'senha' });
    req.flush({ access, refresh: fakeJwt(86400) });

    expect(service.getToken()).toBe(access);
    expect(service.isLoggedIn()).toBeTrue();
    expect(states).toEqual([false, true]);
  });

  it('clears the session on logout', () => {
    service.login('ana@pet4lov.com', 'senha').subscribe();
    http.expectOne(`${environment.apiUrl}/auth/obtain/`).flush({ access: fakeJwt(), refresh: fakeJwt() });

    service.logout();

    expect(service.getToken()).toBe('');
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('reads the expiration from the token payload', () => {
    const expiration = tokenExpiration(fakeJwt(60));

    expect(expiration!.getTime()).toBeGreaterThan(Date.now());
    expect(tokenExpiration('invalido')).toBeUndefined();
  });
});
