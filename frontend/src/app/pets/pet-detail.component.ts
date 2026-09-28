import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { apiErrorMessage } from '../shared/api-error';
import { Pet } from './pet.model';
import { PetsService } from './pets.service';

@Component({
  selector: 'app-pet-detail',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './pet-detail.component.html',
})
export class PetDetailComponent implements OnChanges {
  private petsService = inject(PetsService);

  @Input({ required: true }) id!: string;

  pet?: Pet;
  errorMessage = '';

  ngOnChanges(): void {
    this.pet = undefined;
    this.errorMessage = '';
    this.petsService.get(this.id).subscribe({
      next: pet => this.pet = pet,
      error: error => this.errorMessage = error.status === 404 ? 'Pet não encontrado.' : apiErrorMessage(error),
    });
  }
}
