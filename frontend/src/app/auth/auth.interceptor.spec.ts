import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { environment } from '../../environments/environment';
import { clearCookies, fakeJwt } from '../testing/fake-jwt';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

describe('authInterceptor', () => {
  let client: HttpClient;
  let http: HttpTestingController;
  let auth: AuthService;
  const petsUrl = `${environment.apiUrl}/pets/`;

  function login(access = fakeJwt()): void {
    auth.login('ana@pet4lov.com', 'senha').subscribe();
    http.expectOne(`${environment.apiUrl}/auth/obtain/`).flush({ access, refresh: fakeJwt(86400) });
  }

  beforeEach(() => {
    clearCookies();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    client = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
    auth = TestBed.inject(AuthService);
  });

  afterEach(() => {
    http.verify();
    clearCookies();
  });

  it('does not send an Authorization header when logged out', () => {
    client.get(petsUrl).subscribe();

    expect(http.expectOne(petsUrl).request.headers.has('Authorization')).toBeFalse();
  });

  it('sends the access token when logged in', () => {
    const access = fakeJwt();
    login(access);

    client.get(petsUrl).subscribe();

    expect(http.expectOne(petsUrl).request.headers.get('Authorization')).toBe(`Bearer ${access}`);
  });

  it('refreshes the token and retries once on 401', () => {
    login();
    const renewed = fakeJwt(3600);
    let body: unknown;

    client.get(petsUrl).subscribe(response => body = response);
    http.expectOne(petsUrl).flush(null, { status: 401, statusText: 'Unauthorized' });
    http.expectOne(`${environment.apiUrl}/auth/refresh/`).flush({ access: renewed });
    const retry = http.expectOne(petsUrl);
    retry.flush([]);

    expect(retry.request.headers.get('Authorization')).toBe(`Bearer ${renewed}`);
    expect(body).toEqual([]);
  });

  it('logs out and redirects to login when the refresh fails', () => {
    login();
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    client.get(petsUrl).subscribe({ error: () => undefined });
    http.expectOne(petsUrl).flush(null, { status: 401, statusText: 'Unauthorized' });
    http.expectOne(`${environment.apiUrl}/auth/refresh/`).flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(auth.isLoggedIn()).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login'], jasmine.anything());
  });
});
