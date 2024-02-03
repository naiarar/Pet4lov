import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) {}

  public pets(atributo = 'type', orderbyasc = true) {
    return this.http.get(
      '/api/pets/?ordering='+(orderbyasc? atributo: '-' + atributo),
    );
  }

  public ongs(atributo = 'cidade', orderbyasc = true) {
    return this.http.get(
      '/api/ongs/?ordering='+(orderbyasc? atributo: '-' + atributo),
    );
  }

  public usuario(id:string) {
    return this.http.get(
      '/api/usuarios/'+id+'/',
    );
  }
  public pet(id:string) {
    return this.http.get(
      '/api/pets/'+id+'/',
    );
  }

  public ong(id:string) {
    return this.http.get(
      '/api/ongs'+id+'/'
    );
  }

  public excluirPet(id:string){
    return this.http.delete(
      '/api/pets/'+id+'/'
    );

  }

  public excluirOng(id:string){
    return this.http.delete(
      '/api/ongs/'+id+'/'
    );
  }

  public criarPet(pet: any) {
    return this.http.post(
      '/api/pets/',
      pet
    );
  }

  public criarOng(ong: any) {
    return this.http.post(
      '/api/ongs/',
      ong
    );
  }

  public atualizarPet(id: string, pet: any) {
    return this.http.put(
      '/api/pets/'+id+'/',
      pet
    );
  }

  public atualizarOng(id: string, ong: any) {
    return this.http.put(
      '/api/ongs/'+id+'/',
      ong
    );
  }
}
