import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let auth: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    auth = jasmine.createSpyObj<AuthService>('AuthService', ['login']);
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([]), { provide: AuthService, useValue: auth }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('does not call the API when the form is invalid', () => {
    component.form.setValue({ email: 'invalido', password: '' });

    component.onSubmit();

    expect(auth.login).not.toHaveBeenCalled();
  });

  it('navigates to the return url after logging in', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
    auth.login.and.returnValue(of(undefined));
    component.returnUrl = '/pets/novo';
    component.form.setValue({ email: 'ana@pet4lov.com', password: 'senha-forte' });

    component.onSubmit();

    expect(auth.login).toHaveBeenCalledWith('ana@pet4lov.com', 'senha-forte');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/pets/novo');
  });

  it('shows a message when the credentials are wrong', () => {
    auth.login.and.returnValue(throwError(() => new HttpErrorResponse({ status: 401 })));
    component.form.setValue({ email: 'ana@pet4lov.com', password: 'errada' });

    component.onSubmit();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.alert-danger').textContent).toContain('E-mail ou senha inválidos');
  });
});
