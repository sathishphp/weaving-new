import { Component } from '@angular/core';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
  standalone:false,
})
export class LoadingComponent {

  constructor(protected loader:LoaderService){

  }

}
