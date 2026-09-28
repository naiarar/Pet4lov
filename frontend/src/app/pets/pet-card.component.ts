import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Pet } from './pet.model';

@Component({
  selector: 'app-pet-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="card h-100 shadow-sm">
      <img [src]="pet.image || 'assets/pet-placeholder.png'" class="card-img-top card-img-pet" [class.is-placeholder]="!pet.image" [alt]="'Foto de ' + (pet.name_animal || pet.type)" [attr.loading]="eager ? 'eager' : 'lazy'" />
      <div class="card-body d-flex flex-column">
        <h2 class="h5 card-title mb-1">{{ pet.name_animal || 'Sem nome' }}</h2>
        <p class="card-text text-body-secondary small mb-2">{{ pet.type }} · {{ pet.breed }} · {{ pet.color }}</p>
        <p class="card-text small mb-3">📍 {{ pet.city }}/{{ pet.state }} · {{ pet.ong_name }}</p>
        <a [routerLink]="['/pets', pet.id_animal]" class="btn btn-outline-primary btn-sm mt-auto stretched-link">Quero conhecer</a>
      </div>
    </div>
  `,
})
export class PetCardComponent {
  @Input({ required: true }) pet!: Pet;
  @Input() eager = false;
}
