import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DataTableComponent } from '../../../core/shared/data-table/data-table.component';
import { MachineBrand } from '../../models';
import { TableColHeaderKeys } from '../../../core/shared/data-table/table';
import { MachineBrandService } from '../_services/machine-brand.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DEFAULT_VALUES } from '../../../constants';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmBoxComponent } from '../../../core/shared/components/confirm-box/confirm-box.component';

@Component({
  selector: 'app-machine-brand-list',
  standalone: false,
  templateUrl: './machine-brand-list.component.html',
  styleUrl: './machine-brand-list.component.scss'
})
export class MachineBrandListComponent implements OnInit, OnDestroy {

  private unsubscribe: Subject<void> = new Subject<void>();
  machineBrandList!: MachineBrand[];
  paging: { page?: number; size?: number; totalRecords?: number; searchText?: string; pageNumber?: number } = {};
  tableId = "machine-brand-list";
  sortField = "machine_brand_id";
  @ViewChild('dataTable') dataTable!: DataTableComponent;
  headerList: TableColHeaderKeys[] = [
    {
      header: 'Department',
      field: 'department_name',
      type: 'default',
      width: '10%',
      sortable: true
    },
    {
      header: 'Machine Brand Code',
      field: 'machine_brand_code',
      type: 'default',
      width: '10%',
      sortable: true
    },
    {
      header: 'Machine Brand Name',
      field: 'machine_brand_name_eng',
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
    private _masterService: MachineBrandService,
    private _toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal
  ) {

  }
  ngOnInit(): void {
    this.paging.page = DEFAULT_VALUES.PAGE_NUMBER;
    this.paging.size = DEFAULT_VALUES.PAGE_SIZE;
    this.loadMachineBrandList();
  }

  loadMachineBrandList() {
    this._masterService
      .getMachineBrandList()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: any) => {
        this.paging.totalRecords = result.length || [];
        this.machineBrandList = result;
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
        this.router.navigate(['/master/machine-brand/edit/' + event.row.machine_brand_id]);
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
    this._masterService.updateMachineBrandStatus(rows.machine_brand_id, flag).pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
      if (res?.data?.changedRows > 0) {
        this._toastr.success("Status has been updated Successfully", 'Success');
        this.loadMachineBrandList();
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
        this.deleteMachineBrand(row);
      }

    }).catch((err) => {
      console.log('User dismissed the dialog');
    })
  }

  deleteMachineBrand(row: any) {
    this._masterService.removeMachineBrand(row.machine_brand_id).pipe(takeUntil(this.unsubscribe)).subscribe((res) => {
      this._toastr.success("Machine Brand details has been removed Successfully", 'Success');
      this.loadMachineBrandList();
    })
  }

  navigateToCreateMachineBrand() {
    this.router.navigate(['/master/machine-brand/create']);
  }
}