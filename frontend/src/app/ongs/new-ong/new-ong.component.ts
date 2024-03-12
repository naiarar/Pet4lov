import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OngsService } from '../ongs.service';

@Component({
  selector: 'app-new-ongs',
  standalone: true,
  imports: [],
  templateUrl: './new-ong.component.html',
  styleUrl: './new-ong.component.scss'
})
export class NewOngsComponent {
  newOngForm = new FormGroup({
    id_ong : new FormControl('', Validators.required),
    name : new FormControl('', Validators.required),
    document : new FormControl('', Validators.required),
    adress : new FormControl('', Validators.required),
    city : new FormControl('', Validators.required),
    state : new FormControl('', Validators.required),
    email : new FormControl('', Validators.required),
  })


  constructor(
    private router: Router,
    private ongsService: OngsService
  ) {}



  onSubmit() {
    this.ongsService.criarOng(this.newOngForm.value).subscribe(() => {
      this.router.navigate([`/ongs`]);
    });
  }
}
