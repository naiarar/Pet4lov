import { Component } from '@angular/core';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-ongs',
  templateUrl: './ongs.component.html',
  styleUrls: ['./ongs.component.css']
})
export class OngsComponent {
  ongs: any
  orderbyasc : boolean
  constructor(private ongsService: ApiService) {
    this.orderbyasc = true
    this.getOngs()
  }

  getOngs (){
    this.ongsService.ongs('valor',this.orderbyasc).subscribe(result => {
      this.ongs = result
    })
  }

  ordenaOngs (){
    this.orderbyasc = !this.orderbyasc
    this.getOngs()
  }
}
