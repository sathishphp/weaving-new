import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Branch } from '../../models';
import { DataTableComponent } from '../../../core/shared/data-table/data-table.component';
import { TableColHeaderKeys } from '../../../core/shared/data-table/table';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BranchService } from '../_services/branch.service';
import { DEFAULT_VALUES } from '../../../constants';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmBoxComponent } from '../../../core/shared/components/confirm-box/confirm-box.component';

@Component({
  selector: 'app-branch-list',
  standalone: false,
  templateUrl: './branch-list.component.html',
  styleUrl: './branch-list.component.scss'
})
export class BranchListComponent  implements OnInit,OnDestroy{

  private unsubscribe: Subject<void> = new Subject<void>();
  branchList!: Branch[];
  paging: { page?: number; size?: number; totalRecords?: number; searchText?: string; pageNumber?: number } = {};
  tableId = "branch-list";
  sortField = "branch_id";
  @ViewChild('dataTable') dataTable!: DataTableComponent;
  headerList: TableColHeaderKeys[] = [
    {
      header: 'Branch Code',
      field: 'branch_code',
      type: 'default',
      width: '10%',
      sortable: true
    },
    {
      header: 'Branch Name',
      field: 'branch_name_eng',
      type: 'default',
      width: '10%',
      sortable: true
    }, {
      header: 'Address',
      field: 'address',
      type: 'default',
      width: '20%',
      sortable: true
    },
    {
      header: 'City',
      field: 'city',
      type: 'default',
      width: '10%',
      sortable: true
    },
    {
      header: 'Email',
      field: 'email',
      type: 'default',
      width: '10%',
      sortable: true
    },
    {
      header: 'Actions',
      field: 'Actions',
      type: 'actionButton',
      sortable: false,
      width: '10%',
      icon: '',
      selectOptions: [
        { action: 'flag', label: 'Flag', icon: 'fas fa-check', 'btnClass': 'bt btn-primary' },
        { action: 'edit', label: 'Edit', icon: 'fas fa-pencil-alt', 'btnClass': 'bt btn-primary' },
        { action: 'delete', label: 'Delete', icon: 'fas fa-trash', 'btnClass': 'bt btn-danger' }
      ]
    }
  ];
  result: any;

  constructor(
    private _masterService: BranchService,
    private _toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal
  ) {

  }
  ngOnInit(): void {
    this.paging.page = DEFAULT_VALUES.PAGE_NUMBER;
    this.paging.size = DEFAULT_VALUES.PAGE_SIZE;
    this.loadBranchList();
  }

  loadBranchList() {
    this._masterService
      .getBranchList()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: any) => {
        this.paging.totalRecords = result.length || [];
        this.branchList = result;
      }, (err:HttpErrorResponse) => {
        console.error(err);
      });
  }

  ngOnDestroy(): void {
    this.paging.page = DEFAULT_VALUES.PAGE_NUMBER;
    this.paging.size = DEFAULT_VALUES.PAGE_SIZE;
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  performBtnAction(event: any) {
    switch (event.action) {
      case 'Edit':
        this.router.navigate(['/master/branch/edit/' + event.row.branch_id]);
        break;
      case 'Flag':
        this.updateStatus(event.row);
        break;
      case 'Delete':
        this.confirmPopup(event, event.row);
        break;
    }
  }

  updateStatus(rows: any) {
    const flag = { flag: (rows.flag === 1) ? 0 : 1 };
    this._masterService.updateBranchStatus(rows.branch_id, flag).pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
      if (res?.data?.changedRows > 0) {
        this._toastr.success("Status has been updated Successfully", 'Success');
        this.loadBranchList();
      }
    })
  }

  confirmPopup(event: any, row: any) {
    let options: NgbModalOptions = {
      size: 'md',
    };
    const modalRef = this.modalService.open(ConfirmBoxComponent, options);
    modalRef.componentInstance.title = 'Delete Confirmation';
    modalRef.componentInstance.message = 'Do you want to delete this record?';

    modalRef.result.then((res) => {
      if (res) {
        this.deleteBranch(row);
      }

    }).catch((err) => {
      console.log('User dismissed the dialog');
    })
  }

  deleteBranch(row: any) {
    this._masterService.removeBranch(row.branch_id).pipe(takeUntil(this.unsubscribe)).subscribe((res) => {
      this._toastr.success("Branch details has been removed Successfully", 'Success');
      this.loadBranchList();
    })
  }

  navigateToCreateBranch() {
    this.router.navigate(['/master/branch/create']);
  }
}
