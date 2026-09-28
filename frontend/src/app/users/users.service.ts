import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { NewUser, User } from './user.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);

  register(user: NewUser): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/register/`, user);
  }

  me(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/usuarios/me/`);
  }
}
