import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
//import { AuthService } from '../services/auth.service'
import { navItems } from 'src/app/core/default-layout/_nav';
import { Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Employee } from '../../models';
import { AuthService } from '../../../core/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent implements OnInit, OnDestroy {
  public navItems = navItems;
  isError: boolean = false;
  private unsubscribe: Subject<void> = new Subject<void>();
  employeeList: Employee[];
  submitted: any = false;
  loginForm: FormGroup;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      employee_code: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
    this.loadEmployeeList();
  }

  get f() {
    return this.loginForm.controls;
  }

  loadEmployeeList() {
    this.authService
      .getEmployeeList()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: any) => {
        this.employeeList = this.formatEmployee(result);
      }, (err: HttpErrorResponse) => {
        console.error(err);
      });
  }

  formatEmployee(employee) {
    return employee.map((item) => {
      item.fullName = item.employee_code + ' - ' + item.employee_name_eng;
      return item;
    })
  }

  onSingIn() {
    console.log(this.loginForm.value);
    this.authService
      .login(this.loginForm.value)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response:any) => {
        console.log(response);
        //this.authService.saveToken(response.token);
        //this.authService.userData = response;
        this.router.navigate(['/master/company/list']);
      });
  }

  moveToDashboard() {
    this.router.navigate(['dashboard']);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
