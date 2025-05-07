import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { first, Subject, takeUntil } from 'rxjs';
import { DesignationService } from '../_services/designation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchService } from '../../branch/_services/branch.service';
import { DepartmentService } from '../../department/_services/department.service';

@Component({
  selector: 'app-designation-form',
  standalone: false,
  templateUrl: './designation-form.component.html',
  styleUrl: './designation-form.component.scss'
})
export class DesignationFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  submitted = false;
  id!: string;
  isAddMode!: boolean;
  private unsubscribe: Subject<void> = new Subject<void>();
  branchList: any;
  departmentList: any;
  constructor(
    private fb: FormBuilder,
    private _toastr: ToastrService,
    private _masterService: DesignationService,
    private _branchService: BranchService,
    private _departmentService: DepartmentService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;
    this.formValidation();
    this.getBranchList();
    this.getDepartmentList();
    if (!this.isAddMode) {
      this._masterService.getDesignationListById(this.id)
        .pipe(first())
        .subscribe((x: any) => {
          this.form.patchValue(x[0]);
        });
    }
  }

  getBranchList() {
    this._branchService
      .getBranchList()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response: any) => {
        this.branchList = response;
      }, (err) => {
        console.log(err);
      })
  }

  getDepartmentList() {
    this._departmentService
      .getDepartmentList()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response: any) => {
        this.departmentList = response;
      }, (err) => {
        console.log(err);
      })
  }

  get f() {
    return this.form.controls;
  }

  formValidation() {
    this.form = this.fb.group({
      branch_id: [null, [Validators.required]],
      department_id: [null, [Validators.required]],
      designation_code: ['', [Validators.required]],
      designation_name_eng: ['', [Validators.required, Validators.maxLength(200)]],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    if (this.isAddMode) {
      this.saveDesignation();
    } else {
      this.updateDesignation();
    }
  }

  saveDesignation() {
    this._masterService.saveDesignation(this.form.value).pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
      if (res?.insertId > 0) {
        this._toastr.success("Designation Details Saved Successfully.", 'Success');
        this.gotoList();
      }
      if (res.status === 400) {
        this._toastr.error(res.message, 'Error');
      }
    }, (err) => {
      this._toastr.error(err.message, 'Error');
    });
  }

  updateDesignation() {
    this._masterService.updateDesignation(this.id, this.form.value).pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
      if (res && res?.data?.changedRows > 0) {
        this._toastr.success("Designation Details Updated Successfully.", 'Success');
        this.gotoList();
      }
      if (res && res?.data?.changedRows === 0) {
        this._toastr.info("No changes made.", 'info');
        this.gotoList();
      }
    });
  }

  gotoList() {
    this.router.navigate(['/master/designation/list']);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
