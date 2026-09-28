import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pet, PetFilters } from './pet.model';

@Injectable({ providedIn: 'root' })
export class PetsService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/pets/`;

  list(filters: PetFilters = {}): Observable<Pet[]> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value) params = params.set(key, value);
    }
    return this.http.get<Pet[]>(this.url, { params });
  }

  get(id: string): Observable<Pet> {
    return this.http.get<Pet>(`${this.url}${id}/`);
  }

  create(pet: FormData): Observable<Pet> {
    return this.http.post<Pet>(this.url, pet);
  }

  update(id: string, pet: FormData): Observable<Pet> {
    return this.http.patch<Pet>(`${this.url}${id}/`, pet);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}${id}/`);
  }
}
