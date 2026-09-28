import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { BR_STATES } from '../shared/br-states';
import { apiErrorMessage } from '../shared/api-error';
import { UsersService } from '../users/users.service';
import { OngsService } from './ongs.service';

@Component({
  selector: 'app-ong-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './ong-form.component.html',
})
export class OngFormComponent implements OnInit {
  private ongsService = inject(OngsService);
  private usersService = inject(UsersService);
  private router = inject(Router);

  @Input() id?: string;

  readonly states = BR_STATES;
  form = inject(FormBuilder).nonNullable.group({
    name: ['', Validators.required],
    document: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
  });
  loading = true;
  saving = false;
  loadError = '';
  errorMessage = '';

  get isEdit(): boolean {
    return !!this.id;
  }

  ngOnInit(): void {
    forkJoin({
      user: this.usersService.me(),
      ong: this.id ? this.ongsService.get(this.id) : of(null),
    }).subscribe({
      next: ({ user, ong }) => {
        if (ong && ong.responsible !== user.id_user) {
          this.loadError = 'Você só pode editar a sua própria ONG.';
        } else if (ong) {
          const { id_ong, responsible, ...values } = ong;
          this.form.setValue(values);
        }
        this.loading = false;
      },
      error: error => {
        this.loadError = error.status === 404 ? 'ONG não encontrada.' : apiErrorMessage(error, 'Não foi possível carregar o formulário.');
        this.loading = false;
      },
    });
  }

  isInvalid(field: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[field];
    return control.touched && control.invalid;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const ong = this.form.getRawValue();
    this.saving = true;
    this.errorMessage = '';
    const request = this.id ? this.ongsService.update(this.id, ong) : this.ongsService.create(ong);
    request.subscribe({
      next: () => this.router.navigate(['/minha-conta']),
      error: error => {
        this.saving = false;
        this.errorMessage = apiErrorMessage(error, 'Não foi possível salvar a ONG.');
      },
    });
  }
}
