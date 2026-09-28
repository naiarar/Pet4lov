import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { OngsService } from '../ongs/ongs.service';
import { PetListComponent } from './pet-list.component';
import { Pet } from './pet.model';
import { PetsService } from './pets.service';

const rex = {
  id_animal: '1',
  name_animal: 'Rex',
  type: 'Cachorro',
  breed: 'SRD',
  color: 'Caramelo',
  city: 'São Paulo',
  state: 'SP',
  ong_name: 'ONG Patinhas',
  image: null,
} as Pet;

describe('PetListComponent', () => {
  let fixture: ComponentFixture<PetListComponent>;
  let pets: jasmine.SpyObj<PetsService>;

  beforeEach(async () => {
    pets = jasmine.createSpyObj<PetsService>('PetsService', ['list']);
    await TestBed.configureTestingModule({
      imports: [PetListComponent],
      providers: [
        provideRouter([]),
        { provide: PetsService, useValue: pets },
        { provide: OngsService, useValue: jasmine.createSpyObj('OngsService', ['get']) },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(PetListComponent);
  });

  function render(inputs: Partial<Pick<PetListComponent, 'search' | 'type' | 'ong'>> = {}): void {
    Object.assign(fixture.componentInstance, inputs);
    fixture.componentInstance.ngOnChanges();
    fixture.detectChanges();
  }

  it('lists pets returned by the API using the route filters', () => {
    pets.list.and.returnValue(of([rex]));

    render({ search: 'rex', type: 'Cachorro' });

    expect(pets.list).toHaveBeenCalledWith({ search: 'rex', type: 'Cachorro', ong: '' });
    expect(fixture.nativeElement.querySelectorAll('app-pet-card').length).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Rex');
  });

  it('shows an empty state when no pet matches', () => {
    pets.list.and.returnValue(of([]));

    render();

    expect(fixture.nativeElement.textContent).toContain('Nenhum pet encontrado');
  });
});
