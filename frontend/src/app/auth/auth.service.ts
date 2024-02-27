import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

interface IUser{

    id_user: string
    name: string
    email: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user?: IUser
  constructor(private http: HttpClient, private cookieService: CookieService) { }

  canActivate(): boolean {
    return this.cookieService.check('access');
  }

  login(email: string, password: string) {
    return this.http.post<any>('http://localhost:8000/api/auth/obtain/', { email, password }).subscribe(response => {
      this.user = response.user
      this.cookieService.set('id_user', response.user.id_user);
      this.cookieService.set('access', response.access);
    });
  }

  logout() {
    // Limpar o cookie quando o usuário fizer logout
    this.cookieService.delete('access');
    this.cookieService.delete('id_user');
  }

  getToken() {
    // Obter o token do cookie
    return this.cookieService.get('access');
  }

  getUserId() {
    // Obter o token do cookie
    return this.cookieService.get('id_user');
  }

  getMe() {
    if (!this.getUserId())return
    return this.user
  }

}
