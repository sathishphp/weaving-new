import { Component, OnInit } from '@angular/core';
import { navItems } from '../_nav';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-main-sidebar',
  templateUrl: './main-sidebar.component.html',
  standalone:false,
  styleUrls: ['./main-sidebar.component.css']
})
export class MainSidebarComponent implements OnInit {
  public navItems = navItems;
  user: any;
  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    this.user = this.authService.userData.userInfo;
  }

}
