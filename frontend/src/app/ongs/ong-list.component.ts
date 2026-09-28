import { Component, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { apiErrorMessage } from '../shared/api-error';
import { Ong } from './ong.model';
import { OngsService } from './ongs.service';

@Component({
  selector: 'app-ong-list',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './ong-list.component.html',
})
export class OngListComponent implements OnInit {
  private ongsService = inject(OngsService);

  search = new FormControl('', { nonNullable: true });
  ongs: Ong[] = [];
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMessage = '';
    this.ongsService.list(this.search.value).subscribe({
      next: ongs => {
        this.ongs = ongs;
        this.loading = false;
      },
      error: error => {
        this.errorMessage = apiErrorMessage(error, 'Não foi possível carregar as ONGs.');
        this.loading = false;
      },
    });
  }
}
