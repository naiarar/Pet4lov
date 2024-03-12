import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';


@Injectable({
  providedIn: 'root'
})
export class OngsService {

  constructor(private http: HttpClient) {}

    ong(id:string) {
    return this.http.get(
      environment.apiUrl+'/api/ongs/'+id+'/',
    );
  }

   criarOng(user: any) {
    return this.http.post(
      environment.apiUrl+'/api/ongs/',
      user
    );
  }


   atualizarOng(id: string, user: any) {
    return this.http.patch(
      environment.apiUrl+'/api/ongs/'+id+'/',
      user
    );
  }

   excluirOng(id: string) {
    return this.http.delete(
      environment.apiUrl+'/api/ongs/'+id+'/'
    );
  }

}
