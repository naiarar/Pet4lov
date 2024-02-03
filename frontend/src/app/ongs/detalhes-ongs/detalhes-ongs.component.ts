import { ApiService } from './../../service/api.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalhes-ongs',
  templateUrl: './detalhes-ongs.component.html',
  styleUrls: ['./detalhes-ongs.component.scss']
})
export class DetalhesOngsComponent {

  ongs: any
  constructor(private route: ActivatedRoute,
    private ApiService: ApiService) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.ApiService.ongs(id).subscribe(result => {
        this.ongs = result
      })
    }

  }

}
