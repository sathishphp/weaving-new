import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first, Subject, takeUntil } from 'rxjs';
import { CompanyService } from '../_services/company.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-company-form',
  standalone: false,
  templateUrl: './company-form.component.html',
  styleUrl: './company-form.component.scss'
})
export class CompanyFormComponent implements OnInit,OnDestroy {
  form!: FormGroup;
  submitted = false;
  id!: string;
  isAddMode!: boolean;
  private unsubscribe: Subject<void> = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private _toastr: ToastrService,
    private _masterService: CompanyService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;
    this.formValidation();
    if (!this.isAddMode) {
      this._masterService.getCompanyListById(this.id)
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
      company_code: ['', [Validators.required]],
      company_name_eng: ['', [Validators.required, Validators.maxLength(200)]],
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
      this.saveCompany();
    } else {
      this.updateCompany();
    }
  }

  saveCompany() {
    this._masterService.saveCompany(this.form.value).pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
      if (res?.insertId > 0) {
        this._toastr.success("Company Details Saved Successfully.", 'Success');
        this.gotoList();
      }
      if (res.status === 400) {
        this._toastr.error(res.message, 'Error');
      }
    }, (err) => {
      this._toastr.error(err.message, 'Error');
    });
  }

  updateCompany() {
    this._masterService.updateCompany(this.id, this.form.value).pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
      if (res && res?.data?.changedRows > 0) {
        this._toastr.success("Company Details Updated Successfully.", 'Success');
        this.gotoList();
      }
      if (res && res?.data?.changedRows === 0) {
        this._toastr.info("No changes made.", 'info');
        this.gotoList();
      }
    });
  }

  gotoList() {
    this.router.navigate(['/master/company/list']);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
