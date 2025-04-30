import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.css'],
  standalone:false
})
export class MainFooterComponent implements OnInit {
  date = new Date();
  constructor() { }

  ngOnInit(): void {
  }

}
