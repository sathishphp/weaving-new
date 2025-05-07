import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { first, Subject, takeUntil } from 'rxjs';
import { ShedService } from '../_services/shed.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchService } from '../../branch/_services/branch.service';

@Component({
  selector: 'app-shed-form',
  standalone: false,
  templateUrl: './shed-form.component.html',
  styleUrl: './shed-form.component.scss'
})
export class ShedFormComponent   implements OnInit,OnDestroy {
  form!: FormGroup;
  submitted = false;
  id!: string;
  isAddMode!: boolean;
  private unsubscribe: Subject<void> = new Subject<void>();
  branchList: any;
  constructor(
    private fb: FormBuilder,
    private _toastr: ToastrService,
    private _masterService: ShedService,
    private router: Router,
    private route: ActivatedRoute,
    private branchService:BranchService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;
    this.formValidation();
    if (!this.isAddMode) {
      this._masterService.getShedListById(this.id)
        .pipe(first())
        .subscribe((x: any) => {
          this.form.patchValue(x[0]);
        });
    }
    this.getBranchList();
  }

  get f() {
    return this.form.controls;
  }

  getBranchList(){
    this.branchService
        .getBranchList()
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response:any)=>{
          this.branchList = response;
        },(err)=>{
          console.log(err);
        })
  }
  formValidation() {
    this.form = this.fb.group({
      branch_id: [null, [Validators.required]],
      shed_code: ['', [Validators.required]],
      shed_name_eng: ['', [Validators.required, Validators.maxLength(200)]]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    if (this.isAddMode) {
      this.saveShed();
    } else {
      this.updateShed();
    }
  }

  saveShed() {
    this._masterService.saveShed(this.form.value).pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
      if (res?.insertId > 0) {
        this._toastr.success("Shed Details Saved Successfully.", 'Success');
        this.gotoList();
      }
      if (res.status === 400) {
        this._toastr.error(res.message, 'Error');
      }
    }, (err) => {
      this._toastr.error(err.message, 'Error');
    });
  }

  updateShed() {
    this._masterService.updateShed(this.id, this.form.value).pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
      if (res && res?.data?.changedRows > 0) {
        this._toastr.success("Shed Details Updated Successfully.", 'Success');
        this.gotoList();
      }
      if (res && res?.data?.changedRows === 0) {
        this._toastr.info("No changes made.", 'info');
        this.gotoList();
      }
    });
  }

  gotoList() {
    this.router.navigate(['/master/shed/list']);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}


