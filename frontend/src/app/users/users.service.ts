import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) {}



   user(id:string) {
    return this.http.get(
      environment.apiUrl+'/api/usuarios/'+id+'/',
    );
  }

   criarUser(user: any) {
    return this.http.post(
      environment.apiUrl+'/api/usuarios/',
      user
    );
  }


   atualizarUser(id: string, user: any) {
    return this.http.patch(
      environment.apiUrl+'/api/usuarios/'+id+'/',
      user
    );
  }

   excluirUser(id: string) {
    return this.http.delete(
      environment.apiUrl+'/api/usuarios/'+id+'/'
    );
  }




}
