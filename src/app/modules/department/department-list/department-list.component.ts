import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Department } from '../../models';
import { TableColHeaderKeys } from '../../../core/shared/data-table/table';
import { DataTableComponent } from '../../../core/shared/data-table/data-table.component';
import { DepartmentService } from '../_services/department.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DEFAULT_VALUES } from '../../../constants';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmBoxComponent } from '../../../core/shared/components/confirm-box/confirm-box.component';

@Component({
  selector: 'app-department-list',
  standalone: false,
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.scss'
})
export class DepartmentListComponent implements OnInit, OnDestroy {

  private unsubscribe: Subject<void> = new Subject<void>();
  departmentList!: Department[];
  paging: { page?: number; size?: number; totalRecords?: number; searchText?: string; pageNumber?: number } = {};
  tableId = "department-list";
  sortField = "department_id";
  @ViewChild('dataTable') dataTable!: DataTableComponent;
  headerList: TableColHeaderKeys[] = [
    {
      header: 'Department Code',
      field: 'department_code',
      type: 'default',
      width: '10%',
      sortable: true
    },
    {
      header: 'Department Name(English)',
      field: 'department_name_eng',
      type: 'default',
      width: '10%',
      sortable: true
    },
    {
      header: 'Department Name(Language)',
      field: 'department_name_lang',
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
    private _masterService: DepartmentService,
    private _toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal
  ) {

  }
  ngOnInit(): void {
    this.paging.page = DEFAULT_VALUES.PAGE_NUMBER;
    this.paging.size = DEFAULT_VALUES.PAGE_SIZE;
    this.loadDepartmentList();
  }

  loadDepartmentList() {
    this._masterService
      .getDepartmentList()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: any) => {
        this.paging.totalRecords = result.length || [];
        this.departmentList = result;
      }, (err: HttpErrorResponse) => {
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
        this.router.navigate(['/master/department/edit/' + event.row.department_id]);
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
    this._masterService.updateDepartmentStatus(rows.department_id, flag).pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
      if (res?.data?.changedRows > 0) {
        this._toastr.success("Status has been updated Successfully", 'Success');
        this.loadDepartmentList();
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
        this.deleteDepartment(row);
      }

    }).catch((err) => {
      console.log('User dismissed the dialog');
    })
  }

  deleteDepartment(row: any) {
    this._masterService.removeDepartment(row.department_id).pipe(takeUntil(this.unsubscribe)).subscribe((res) => {
      this._toastr.success("Department details has been removed Successfully", 'Success');
      this.loadDepartmentList();
    })
  }

  navigateToCreateDepartment() {
    this.router.navigate(['/master/department/create']);
  }
}


