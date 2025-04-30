import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { first, Subject, takeUntil } from 'rxjs';
import { BranchService } from '../_services/branch.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-branch-form',
  standalone: false,
  templateUrl: './branch-form.component.html',
  styleUrl: './branch-form.component.scss'
})
export class BranchFormComponent  implements OnInit,OnDestroy {
  form!: FormGroup;
  submitted = false;
  id!: string;
  isAddMode!: boolean;
  private unsubscribe: Subject<void> = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private _toastr: ToastrService,
    private _masterService: BranchService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;
    this.formValidation();
    if (!this.isAddMode) {
      this._masterService.getBranchListById(this.id)
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
      branch_code: ['', [Validators.required]],
      branch_name_eng: ['', [Validators.required, Validators.maxLength(200)]],
      address: ['', []],
      city: ['', [Validators.maxLength(50)]],
      pin_code: ['', []],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    if (this.isAddMode) {
      this.saveBranch();
    } else {
      this.updateBranch();
    }
  }

  saveBranch() {
    this._masterService.saveBranch(this.form.value).pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
      if (res?.insertId > 0) {
        this._toastr.success("Branch Details Saved Successfully.", 'Success');
        this.gotoList();
      }
      if (res.status === 400) {
        this._toastr.error(res.message, 'Error');
      }
    }, (err) => {
      this._toastr.error(err.message, 'Error');
    });
  }

  updateBranch() {
    this._masterService.updateBranch(this.id, this.form.value).pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
      if (res && res?.data?.changedRows > 0) {
        this._toastr.success("Branch Details Updated Successfully.", 'Success');
        this.gotoList();
      }
      if (res && res?.data?.changedRows === 0) {
        this._toastr.info("No changes made.", 'info');
        this.gotoList();
      }
    });
  }

  gotoList() {
    this.router.navigate(['/master/branch/list']);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}

