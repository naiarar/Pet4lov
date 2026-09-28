import { Component, Input, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { apiErrorMessage } from '../shared/api-error';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  @Input() returnUrl = '/minha-conta';

  form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  loading = false;
  errorMessage = '';

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();
    this.loading = true;
    this.errorMessage = '';
    this.auth.login(email, password).subscribe({
      next: () => this.router.navigateByUrl(this.returnUrl || '/minha-conta'),
      error: error => {
        this.loading = false;
        this.errorMessage = error.status === 401 ? 'E-mail ou senha inválidos.' : apiErrorMessage(error);
      },
    });
  }
}
