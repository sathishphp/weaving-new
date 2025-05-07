import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Shed } from '../../models';
import { DataTableComponent } from '../../../core/shared/data-table/data-table.component';
import { TableColHeaderKeys } from '../../../core/shared/data-table/table';
import { ShedService } from '../_services/shed.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DEFAULT_VALUES } from '../../../constants';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmBoxComponent } from '../../../core/shared/components/confirm-box/confirm-box.component';

@Component({
  selector: 'app-shed-list',
  standalone: false,
  templateUrl: './shed-list.component.html',
  styleUrl: './shed-list.component.scss'
})
export class ShedListComponent  implements OnInit,OnDestroy{

  private unsubscribe: Subject<void> = new Subject<void>();
  shedList!: Shed[];
  paging: { page?: number; size?: number; totalRecords?: number; searchText?: string; pageNumber?: number } = {};
  tableId = "shed-list";
  sortField = "shed_id";
  @ViewChild('dataTable') dataTable!: DataTableComponent;
  headerList: TableColHeaderKeys[] = [
    {
      header: 'Branch',
      field: 'branch_name',
      type: 'default',
      width: '10%',
      sortable: true
    },
    {
      header: 'Shed Code',
      field: 'shed_code',
      type: 'default',
      width: '10%',
      sortable: true
    },
    {
      header: 'Shed Name',
      field: 'shed_name_eng',
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
    private _masterService: ShedService,
    private _toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal
  ) {

  }
  ngOnInit(): void {
    this.paging.page = DEFAULT_VALUES.PAGE_NUMBER;
    this.paging.size = DEFAULT_VALUES.PAGE_SIZE;
    this.loadShedList();
  }

  loadShedList() {
    this._masterService
      .getShedList()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: any) => {
        this.paging.totalRecords = result.length || [];
        this.shedList = result;
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
        this.router.navigate(['/master/shed/edit/' + event.row.shed_id]);
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
    this._masterService.updateShedStatus(rows.shed_id, flag).pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
      if (res?.data?.changedRows > 0) {
        this._toastr.success("Status has been updated Successfully", 'Success');
        this.loadShedList();
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
        this.deleteShed(row);
      }

    }).catch((err) => {
      console.log('User dismissed the dialog');
    })
  }

  deleteShed(row: any) {
    this._masterService.removeShed(row.shed_id).pipe(takeUntil(this.unsubscribe)).subscribe((res) => {
      this._toastr.success("Shed details has been removed Successfully", 'Success');
      this.loadShedList();
    })
  }

  navigateToCreateShed() {
    this.router.navigate(['/master/shed/create']);
  }
}

