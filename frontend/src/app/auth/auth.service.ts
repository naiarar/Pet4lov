import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';

const ACCESS_COOKIE = 'access';
const REFRESH_COOKIE = 'refresh';

interface TokenPair {
  access: string
  refresh: string
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private cookies = inject(CookieService);
  private loggedIn = new BehaviorSubject<boolean>(this.hasSession());

  readonly isLoggedIn$ = this.loggedIn.asObservable();

  isLoggedIn(): boolean {
    return this.hasSession();
  }

  login(email: string, password: string): Observable<void> {
    return this.http.post<TokenPair>(`${environment.apiUrl}/auth/obtain/`, { email, password }).pipe(
      tap(({ access, refresh }) => {
        this.storeToken(ACCESS_COOKIE, access);
        this.storeToken(REFRESH_COOKIE, refresh);
        this.loggedIn.next(true);
      }),
      map(() => undefined)
    );
  }

  refresh(): Observable<string> {
    const refresh = this.cookies.get(REFRESH_COOKIE);
    return this.http.post<{ access: string }>(`${environment.apiUrl}/auth/refresh/`, { refresh }).pipe(
      tap(({ access }) => this.storeToken(ACCESS_COOKIE, access)),
      map(({ access }) => access)
    );
  }

  logout(): void {
    this.cookies.delete(ACCESS_COOKIE, '/');
    this.cookies.delete(REFRESH_COOKIE, '/');
    this.loggedIn.next(false);
  }

  getToken(): string {
    return this.cookies.get(ACCESS_COOKIE);
  }

  private hasSession(): boolean {
    return this.cookies.check(REFRESH_COOKIE);
  }

  private storeToken(name: string, token: string): void {
    this.cookies.set(name, token, { expires: tokenExpiration(token), path: '/', sameSite: 'Lax' });
  }
}

export function tokenExpiration(token: string): Date | undefined {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return new Date(payload.exp * 1000);
  } catch {
    return undefined;
  }
}
