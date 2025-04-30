import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css'],
  standalone:false
})
export class MainHeaderComponent implements OnInit {

  date = new Date();
  ngOnInit(){
    this.loadCurrentTime();
  }

  loadCurrentTime(){
    setInterval(()=>{
      this.date = new Date();
    },1000);
  }

}
