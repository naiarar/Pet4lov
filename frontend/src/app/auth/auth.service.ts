import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Importe o HttpClient
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'token';
  public isLoggedIn: boolean;
  isLoggedInChange: Subject<boolean> = new Subject<boolean>();

  constructor(
    private http: HttpClient, // Injete o HttpClient
    private router: Router
  ) {
    let token = localStorage.getItem(this.tokenKey);
    this.isLoggedIn = token != null && token.length > 0;
  }

  public login(username: string, password: string): void {
    this.http.post<any>('/api/login', { username, password }).subscribe((response) => {
      const token = response.token; // Supondo que o token seja retornado pela API
      localStorage.setItem(this.tokenKey, token);
      this.toggleIsLoggedIn();
      this.router.navigate(['/']);
    });
  }

  toggleIsLoggedIn() {
    this.isLoggedIn = !this.isLoggedIn;
    this.isLoggedInChange.next(this.isLoggedIn);
  }

  public logout() {
    localStorage.removeItem(this.tokenKey);
    this.toggleIsLoggedIn();
    this.router.navigate(['/login']);
  }

  public getToken(): string | null {
    if (this.isLoggedIn) {
      const tokenString = localStorage.getItem(this.tokenKey);
      if (tokenString) {
        const tokenParsed = JSON.parse(tokenString);
        return tokenParsed.access;
      }
    }
    return null;
  }
}
