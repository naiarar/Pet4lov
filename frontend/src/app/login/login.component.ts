import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm = new FormGroup({
    email:  new FormControl(''),
    password :  new FormControl(''),
  });
  constructor(private route : Router,private service:AuthService) {}
  onSubmit() {
    if (!this.loginForm.value.email|| !this.loginForm.value.password) return

    this.service.login(this.loginForm.value.email,this.loginForm.value.password)
      .add(() => {
        this.route.navigate([`/users/${this.service.user?.id_user}`]);
      })
  }

}
