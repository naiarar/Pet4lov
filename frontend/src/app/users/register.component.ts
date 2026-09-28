import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { apiErrorMessage } from '../shared/api-error';
import { UsersService } from './users.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private usersService = inject(UsersService);
  private router = inject(Router);

  form = inject(FormBuilder).nonNullable.group({
    name: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    document_cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    birth_date: ['', Validators.required],
    address: ['', Validators.required],
    contact: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    terms: [false, Validators.requiredTrue],
  });
  loading = false;
  errorMessage = '';

  isInvalid(field: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[field];
    return control.touched && control.invalid;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { terms, ...user } = this.form.getRawValue();
    this.loading = true;
    this.errorMessage = '';
    this.usersService.register(user).subscribe({
      next: () => this.router.navigate(['/login'], { queryParams: { returnUrl: '/minha-conta' } }),
      error: error => {
        this.loading = false;
        this.errorMessage = apiErrorMessage(error, 'Não foi possível criar a conta.');
      },
    });
  }
}
