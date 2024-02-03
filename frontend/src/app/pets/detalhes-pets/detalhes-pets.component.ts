import { ApiService } from '../../service/api.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalhes-pets',
  templateUrl: './detalhes-pets.component.html',
  styleUrls: ['./detalhes-pets.component.scss']
})
export class DetalhesPetsComponent {

  pets: any
  constructor(private route: ActivatedRoute,
    private ApiService: ApiService) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.ApiService.pets(id).subscribe(result => {
        this.pets = result
      })
    }

  }

}
