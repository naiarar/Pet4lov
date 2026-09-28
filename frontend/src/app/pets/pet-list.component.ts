import { Component, Input, OnChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { apiErrorMessage } from '../shared/api-error';
import { OngsService } from '../ongs/ongs.service';
import { PetCardComponent } from './pet-card.component';
import { PET_TYPES, Pet } from './pet.model';
import { PetsService } from './pets.service';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, PetCardComponent],
  templateUrl: './pet-list.component.html',
})
export class PetListComponent implements OnChanges {
  private petsService = inject(PetsService);
  private ongsService = inject(OngsService);
  private router = inject(Router);

  @Input() search = '';
  @Input() type = '';
  @Input() ong = '';

  readonly types = PET_TYPES;
  filters = inject(FormBuilder).nonNullable.group({ search: '', type: '' });
  pets: Pet[] = [];
  ongName = '';
  loading = true;
  errorMessage = '';

  ngOnChanges(): void {
    this.filters.setValue({ search: this.search ?? '', type: this.type ?? '' }, { emitEvent: false });
    this.load();
  }

  applyFilters(): void {
    const { search, type } = this.filters.getRawValue();
    this.router.navigate(['/pets'], { queryParams: { search: search || null, type: type || null, ong: this.ong || null } });
  }

  clearOng(): void {
    this.router.navigate(['/pets'], { queryParams: { ong: null }, queryParamsHandling: 'merge' });
  }

  private load(): void {
    this.loading = true;
    this.errorMessage = '';
    this.petsService.list({ search: this.search, type: this.type, ong: this.ong }).subscribe({
      next: pets => {
        this.pets = pets;
        this.loading = false;
      },
      error: error => {
        this.errorMessage = apiErrorMessage(error, 'Não foi possível carregar os pets.');
        this.loading = false;
      },
    });

    this.ongName = '';
    if (this.ong) {
      this.ongsService.get(this.ong).subscribe({ next: ong => this.ongName = ong.name, error: () => this.ongName = '' });
    }
  }
}
