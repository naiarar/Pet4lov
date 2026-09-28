import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { PetsService } from './pets.service';

describe('PetsService', () => {
  let service: PetsService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(PetsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('sends only the filters that have a value', () => {
    service.list({ search: 'rex', type: '', ong: undefined }).subscribe();

    const req = http.expectOne(r => r.url === `${environment.apiUrl}/pets/`);
    expect(req.request.params.keys()).toEqual(['search']);
    expect(req.request.params.get('search')).toBe('rex');
  });

  it('uploads pets as multipart form data', () => {
    const data = new FormData();
    data.append('name_animal', 'Rex');

    service.create(data).subscribe();

    const req = http.expectOne(`${environment.apiUrl}/pets/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(data);
  });
});
