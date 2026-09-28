import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin, of, switchMap } from 'rxjs';
import { Ong } from '../ongs/ong.model';
import { OngsService } from '../ongs/ongs.service';
import { Pet } from '../pets/pet.model';
import { PetsService } from '../pets/pets.service';
import { apiErrorMessage } from '../shared/api-error';
import { User } from './user.model';
import { UsersService } from './users.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './account.component.html',
})
export class AccountComponent implements OnInit {
  private usersService = inject(UsersService);
  private ongsService = inject(OngsService);
  private petsService = inject(PetsService);

  user?: User;
  ong: Ong | null = null;
  pets: Pet[] = [];
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.usersService.me().pipe(
      switchMap(user => forkJoin({
        user: of(user),
        ong: this.ongsService.ofResponsible(user.id_user),
        pets: this.petsService.list({ responsible: user.id_user }),
      }))
    ).subscribe({
      next: ({ user, ong, pets }) => {
        this.user = user;
        this.ong = ong;
        this.pets = pets;
        this.loading = false;
      },
      error: error => {
        this.errorMessage = apiErrorMessage(error, 'Não foi possível carregar sua conta.');
        this.loading = false;
      },
    });
  }

  deletePet(pet: Pet): void {
    if (!confirm(`Remover ${pet.name_animal || 'este pet'} da lista de adoção?`)) return;

    this.petsService.delete(pet.id_animal).subscribe({
      next: () => this.pets = this.pets.filter(p => p.id_animal !== pet.id_animal),
      error: error => this.errorMessage = apiErrorMessage(error, 'Não foi possível remover o pet.'),
    });
  }
}
