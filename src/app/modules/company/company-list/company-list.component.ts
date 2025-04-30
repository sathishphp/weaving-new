import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { DEFAULT_VALUES } from 'src/app/constants';
import { CompanyService } from '../_services/company.service';
import { Company } from '../_models/company-model';
import { DataTableComponent } from '../../../core/shared/data-table/data-table.component';
import { TableColHeaderKeys } from '../../../core/shared/data-table/table';
import { ConfirmBoxComponent } from '../../../core/shared/components/confirm-box/confirm-box.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-company-list',
  standalone: false,
  templateUrl: './company-list.component.html',
  styleUrl: './company-list.component.scss'
})
export class CompanyListComponent implements OnInit,OnDestroy{

  private unsubscribe: Subject<void> = new Subject<void>();
  companyVO!: Company[];
  paging: { page?: number; size?: number; totalRecords?: number; searchText?: string; pageNumber?: number } = {};
  tableId = "company-list";
  sortField = "company_id";
  @ViewChild('dataTable') dataTable!: DataTableComponent;
  headerList: TableColHeaderKeys[] = [
    {
      header: 'Company Code',
      field: 'company_code',
      type: 'default',
      width: '10%',
      sortable: true
    },
    {
      header: 'Company Name',
      field: 'company_name_eng',
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
    private _masterService: CompanyService,
    private _toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal
  ) {

  }
  ngOnInit(): void {
    this.paging.page = DEFAULT_VALUES.PAGE_NUMBER;
    this.paging.size = DEFAULT_VALUES.PAGE_SIZE;
    this.loadCompanyList();
  }

  loadCompanyList() {
    this._masterService
      .getCompanyList()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: any) => {
        this.paging.totalRecords = result.length || [];
        this.companyVO = result;
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
        this.router.navigate(['/master/company/edit/' + event.row.company_id]);
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
    this._masterService.updateCompanyStatus(rows.company_id, flag).pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
      if (res?.data?.changedRows > 0) {
        this._toastr.success("Status has been updated Successfully", 'Success');
        this.loadCompanyList();
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
        this.deleteCompany(row);
      }

    }).catch((err) => {
      console.log('User dismissed the dialog');
    })
  }

  deleteCompany(row: any) {
    this._masterService.removeCompany(row.company_id).pipe(takeUntil(this.unsubscribe)).subscribe((res) => {
      this._toastr.success("Company details has been removed Successfully", 'Success');
      this.loadCompanyList();
    })
  }

  navigateToCreateCompany() {
    this.router.navigate(['/master/company/create']);
  }
}

