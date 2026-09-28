import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Ong, OngPayload } from './ong.model';

@Injectable({ providedIn: 'root' })
export class OngsService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/ongs/`;

  list(search = ''): Observable<Ong[]> {
    const params = search ? new HttpParams().set('search', search) : undefined;
    return this.http.get<Ong[]>(this.url, { params });
  }

  get(id: string): Observable<Ong> {
    return this.http.get<Ong>(`${this.url}${id}/`);
  }

  ofResponsible(userId: string): Observable<Ong | null> {
    const params = new HttpParams().set('responsible', userId);
    return this.http.get<Ong[]>(this.url, { params }).pipe(map(ongs => ongs[0] ?? null));
  }

  create(ong: OngPayload): Observable<Ong> {
    return this.http.post<Ong>(this.url, ong);
  }

  update(id: string, ong: OngPayload): Observable<Ong> {
    return this.http.patch<Ong>(`${this.url}${id}/`, ong);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}${id}/`);
  }
}
