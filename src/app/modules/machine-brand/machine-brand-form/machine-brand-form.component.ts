import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { first, Subject, takeUntil } from 'rxjs';
import { MachineBrandService } from '../_services/machine-brand.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from '../../department/_services/department.service';

@Component({
  selector: 'app-machine-brand-form',
  standalone: false,
  templateUrl: './machine-brand-form.component.html',
  styleUrl: './machine-brand-form.component.scss'
})
export class MachineBrandFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  submitted = false;
  id!: string;
  isAddMode!: boolean;
  private unsubscribe: Subject<void> = new Subject<void>();
  departmentList: any;
  constructor(
    private fb: FormBuilder,
    private _toastr: ToastrService,
    private _masterService: MachineBrandService,
    private router: Router,
    private route: ActivatedRoute,
    private departmentService: DepartmentService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;
    this.formValidation();
    if (!this.isAddMode) {
      this._masterService.getMachineBrandListById(this.id)
        .pipe(first())
        .subscribe((x: any) => {
          this.form.patchValue(x[0]);
        });
    }
    this.getDepartmentList();
  }

  get f() {
    return this.form.controls;
  }

  getDepartmentList() {
    this.departmentService
      .getDepartmentList()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response: any) => {
        this.departmentList = response;
      }, (err) => {
        console.log(err);
      })
  }

  formValidation() {
    this.form = this.fb.group({
      department_id: [null, [Validators.required]],
      machine_brand_code: ['', [Validators.required]],
      machine_brand_name_eng: ['', [Validators.required, Validators.maxLength(200)]]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    if (this.isAddMode) {
      this.saveMachineBrand();
    } else {
      this.updateMachineBrand();
    }
  }

  saveMachineBrand() {
    this._masterService.saveMachineBrand(this.form.value).pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
      if (res?.insertId > 0) {
        this._toastr.success("Machine Brand Details Saved Successfully.", 'Success');
        this.gotoList();
      }
      if (res.status === 400) {
        this._toastr.error(res.message, 'Error');
      }
    }, (err) => {
      this._toastr.error(err.message, 'Error');
    });
  }

  updateMachineBrand() {
    this._masterService.updateMachineBrand(this.id, this.form.value).pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
      if (res && res?.data?.changedRows > 0) {
        this._toastr.success("Machine Brand Details Updated Successfully.", 'Success');
        this.gotoList();
      }
      if (res && res?.data?.changedRows === 0) {
        this._toastr.info("No changes made.", 'info');
        this.gotoList();
      }
    });
  }

  gotoList() {
    this.router.navigate(['/master/machine-brand/list']);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
