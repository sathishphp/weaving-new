import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Designation } from '../../models';
import { DataTableComponent } from '../../../core/shared/data-table/data-table.component';
import { TableColHeaderKeys } from '../../../core/shared/data-table/table';
import { DesignationService } from '../_services/designation.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DEFAULT_VALUES } from '../../../constants';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmBoxComponent } from '../../../core/shared/components/confirm-box/confirm-box.component';

@Component({
  selector: 'app-designation-list',
  standalone: false,
  templateUrl: './designation-list.component.html',
  styleUrl: './designation-list.component.scss'
})
export class DesignationListComponent implements OnInit, OnDestroy {

  private unsubscribe: Subject<void> = new Subject<void>();
  designationList!: Designation[];
  paging: { page?: number; size?: number; totalRecords?: number; searchText?: string; pageNumber?: number } = {};
  tableId = "designation-list";
  sortField = "designation";
  @ViewChild('dataTable') dataTable!: DataTableComponent;
  headerList: TableColHeaderKeys[] = [
    {
      header: 'Branch',
      field: 'branch',
      type: 'default',
      width: '10%',
      sortable: true
    },
    {
      header: 'Department',
      field: 'department',
      type: 'default',
      width: '10%',
      sortable: true
    },
    {
      header: 'Designation Code',
      field: 'designation_code',
      type: 'default',
      width: '10%',
      sortable: true
    },
    {
      header: 'Designation Name(Language)',
      field: 'designation_name_eng',
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
    private _masterService: DesignationService,
    private _toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal
  ) {

  }
  ngOnInit(): void {
    this.paging.page = DEFAULT_VALUES.PAGE_NUMBER;
    this.paging.size = DEFAULT_VALUES.PAGE_SIZE;
    this.loadDesignationList();
  }

  loadDesignationList() {
    this._masterService
      .getDesignationList()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: any) => {
        this.paging.totalRecords = result.length || [];
        this.designationList = result;
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
        this.router.navigate(['/master/designation/edit/' + event.row.designation_id]);
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
    this._masterService.updateDesignationStatus(rows.designation_id, flag).pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
      if (res?.data?.changedRows > 0) {
        this._toastr.success("Status has been updated Successfully", 'Success');
        this.loadDesignationList();
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
        this.deleteDesignation(row);
      }

    }).catch((err) => {
      console.log('User dismissed the dialog');
    })
  }

  deleteDesignation(row: any) {
    this._masterService.removeDesignation(row.designation_id).pipe(takeUntil(this.unsubscribe)).subscribe((res) => {
      this._toastr.success("Designation details has been removed Successfully", 'Success');
      this.loadDesignationList();
    })
  }

  navigateToCreateDesignation() {
    this.router.navigate(['/master/designation/create']);
  }
}
