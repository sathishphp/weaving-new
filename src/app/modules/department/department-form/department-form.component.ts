import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { first, Subject, takeUntil } from 'rxjs';
import { DepartmentService } from '../_services/department.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-department-form',
  standalone: false,
  templateUrl: './department-form.component.html',
  styleUrl: './department-form.component.scss'
})
export class DepartmentFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  submitted = false;
  id!: string;
  isAddMode!: boolean;
  private unsubscribe: Subject<void> = new Subject<void>();
  branchList: any;
  constructor(
    private fb: FormBuilder,
    private _toastr: ToastrService,
    private _masterService: DepartmentService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;
    this.formValidation();
    if (!this.isAddMode) {
      this._masterService.getDepartmentListById(this.id)
        .pipe(first())
        .subscribe((x: any) => {
          this.form.patchValue(x[0]);
        });
    }
  }

  get f() {
    return this.form.controls;
  }

  formValidation() {
    this.form = this.fb.group({
      department_code: ['', [Validators.required]],
      department_name_eng: ['', [Validators.required, Validators.maxLength(200)]],
      department_name_lang: ['', [Validators.required, Validators.maxLength(200)]],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    if (this.isAddMode) {
      this.saveDepartment();
    } else {
      this.updateDepartment();
    }
  }

  saveDepartment() {
    this._masterService.saveDepartment(this.form.value).pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
      if (res?.insertId > 0) {
        this._toastr.success("Department Details Saved Successfully.", 'Success');
        this.gotoList();
      }
      if (res.status === 400) {
        this._toastr.error(res.message, 'Error');
      }
    }, (err) => {
      this._toastr.error(err.message, 'Error');
    });
  }

  updateDepartment() {
    this._masterService.updateDepartment(this.id, this.form.value).pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
      if (res && res?.data?.changedRows > 0) {
        this._toastr.success("Department Details Updated Successfully.", 'Success');
        this.gotoList();
      }
      if (res && res?.data?.changedRows === 0) {
        this._toastr.info("No changes made.", 'info');
        this.gotoList();
      }
    });
  }

  gotoList() {
    this.router.navigate(['/master/department/list']);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}