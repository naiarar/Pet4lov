import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin, of, switchMap } from 'rxjs';
import { Ong } from '../ongs/ong.model';
import { OngsService } from '../ongs/ongs.service';
import { BR_STATES } from '../shared/br-states';
import { apiErrorMessage } from '../shared/api-error';
import { UsersService } from '../users/users.service';
import { PET_TYPES, Pet } from './pet.model';
import { PetsService } from './pets.service';

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './pet-form.component.html',
})
export class PetFormComponent implements OnInit {
  private petsService = inject(PetsService);
  private ongsService = inject(OngsService);
  private usersService = inject(UsersService);
  private router = inject(Router);

  @Input() id?: string;

  readonly types = PET_TYPES;
  readonly states = BR_STATES;
  form = inject(FormBuilder).nonNullable.group({
    name_animal: ['', Validators.required],
    type: ['', Validators.required],
    breed: ['', Validators.required],
    color: ['', Validators.required],
    birth_date: ['', Validators.required],
    health_condition: ['', Validators.required],
    vaccination_status: [''],
    deworming_status: [''],
    observations: ['', Validators.maxLength(250)],
    city: ['', Validators.required],
    state: ['', Validators.required],
  });
  ong: Ong | null = null;
  currentImage: string | null = null;
  image: File | null = null;
  loading = true;
  saving = false;
  loadError = '';
  errorMessage = '';

  get isEdit(): boolean {
    return !!this.id;
  }

  ngOnInit(): void {
    this.usersService.me().pipe(
      switchMap(user => forkJoin({
        user: of(user),
        ong: this.ongsService.ofResponsible(user.id_user),
        pet: this.id ? this.petsService.get(this.id) : of(null),
      }))
    ).subscribe({
      next: ({ user, ong, pet }) => {
        this.ong = ong;
        if (pet && pet.responsible !== user.id_user) {
          this.loadError = 'Você só pode editar pets cadastrados por você.';
        } else if (pet) {
          this.fill(pet);
        } else if (ong) {
          this.form.patchValue({ city: ong.city, state: ong.state });
        }
        this.loading = false;
      },
      error: error => {
        this.loadError = error.status === 404 ? 'Pet não encontrado.' : apiErrorMessage(error, 'Não foi possível carregar o formulário.');
        this.loading = false;
      },
    });
  }

  isInvalid(field: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[field];
    return control.touched && control.invalid;
  }

  onImageChange(event: Event): void {
    this.image = (event.target as HTMLInputElement).files?.[0] ?? null;
  }

  onSubmit(): void {
    if (this.form.invalid || !this.ong) {
      this.form.markAllAsTouched();
      return;
    }

    const data = new FormData();
    data.append('ong', this.ong.id_ong);
    for (const [key, value] of Object.entries(this.form.getRawValue())) {
      data.append(key, value);
    }
    if (this.image) data.append('image', this.image);

    this.saving = true;
    this.errorMessage = '';
    const request = this.id ? this.petsService.update(this.id, data) : this.petsService.create(data);
    request.subscribe({
      next: pet => this.router.navigate(['/pets', pet.id_animal]),
      error: error => {
        this.saving = false;
        this.errorMessage = apiErrorMessage(error, 'Não foi possível salvar o pet.');
      },
    });
  }

  private fill(pet: Pet): void {
    this.currentImage = pet.image;
    this.form.patchValue({
      name_animal: pet.name_animal ?? '',
      type: pet.type,
      breed: pet.breed,
      color: pet.color,
      birth_date: pet.birth_date,
      health_condition: pet.health_condition,
      vaccination_status: pet.vaccination_status ?? '',
      deworming_status: pet.deworming_status ?? '',
      observations: pet.observations ?? '',
      city: pet.city,
      state: pet.state,
    });
  }
}
