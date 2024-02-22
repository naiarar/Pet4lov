import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }
  canActivate(): boolean {
    return this.cookieService.check('token');
  }

  login(username: string, password: string) {
    this.http.post<any>('/login', { username, password }).subscribe(response => {
      // Salvar o token em um cookie
      this.cookieService.set('token', response.token);
    });
  }

  logout() {
    // Limpar o cookie quando o usuário fizer logout
    this.cookieService.delete('token');
  }

  getToken() {
    // Obter o token do cookie
    return this.cookieService.get('token');
  }

  isLoggedIn() {
    // Verificar se o token está presente
    return this.cookieService.check('token');
  }
}
