import { UsersService } from './../users.service';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.scss'
})
export class NewUserComponent {
  newUserForm = new FormGroup({
    name: new FormControl('', Validators.required),
    document_cpf: new FormControl('0', Validators.required),
    birth_date :new FormControl('', Validators.required),
    adress: new FormControl('', Validators.required),
    email : new FormControl('', Validators.required),
    contact : new FormControl('', Validators.required),
    password : new FormControl('', Validators.required),
    username : new FormControl('', Validators.required),

  })

  constructor(
    private router: Router,
    private userService: UsersService
  ) {}



  onSubmit() {
    this.userService.criarUser(this.newUserForm.value).subscribe(() => {
      this.router.navigate([`/login`]);
    });
  }

}
