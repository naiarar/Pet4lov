import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';

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
  isLoggedIn: boolean = false;
  isLoggedInChange: Subject<boolean> = new Subject<boolean>();
  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.isLoggedIn = this.canActivate()
   }
  canActivate(): boolean {
    return this.cookieService.check('access');
  }

  login(email: string, password: string) {
    return this.http.post<any>('http://localhost:8000/api/auth/obtain/', { email, password }).subscribe(response => {
      this.user = response.user
      this.cookieService.set('id_user', response.user.id_user);
      this.cookieService.set('access', response.access);
      this.isLoggedIn = true
      this.isLoggedInChange.next(this.isLoggedIn);
    });
  }

  logout() {
    // Limpar o cookie quando o usuário fizer logout
    this.cookieService.delete('access');
    this.cookieService.delete('id_user');
    this.isLoggedIn = false
    this.isLoggedInChange.next(this.isLoggedIn);
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

    return this.http.get<any>('http://localhost:8000/api/usuarios/'+this.getUserId()).subscribe(response => {
      this.user = response
    });
  }

}
