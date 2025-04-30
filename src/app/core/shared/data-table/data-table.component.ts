import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { TableColHeaderKeys } from './table';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-data-table',
  standalone: false,
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent implements OnInit, OnDestroy,OnChanges {
  @ViewChild('dt') dataTable!: any;
  page: number = 1;
  paginateData: any[] = [];
  first: number = 0;
  last: number = 0;
  @Input('tableId') set tableRef(id: string) {
    this.tableId = id;
  }
  tableId!: String;
  @Input('pageLength') totalRecords!: any;
  @Input() pageNumber: any = 1;
  @Input('columnKeys') set headerCols(cols: TableColHeaderKeys[]) {
    this.columnKeys = cols;
  }
  data: any[] = [];
  allData: any[] = [];
  @Input('data') set dataProps(d: any[]) {
    this.data = d;
    this.allData = d;
    this.onPageChange();
  }
  columnKeys!: TableColHeaderKeys[];
  @Output() loadRecord: EventEmitter<any> = new EventEmitter();
  @Input() rowsPerPageOptions: any = [10, 25, 50, 100];
  @Input() rows = 10;
  @Input() sortOrder = -1;
  @Input() sortField!: any;
  @Input() sortable!: any;
  @Input() searchable: boolean = false;
  @Output() performGlobalAction: EventEmitter<any> = new EventEmitter();
  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: boolean = true;
  currentPage: number = 0;
  @Input() pageSize: number = 10;
  ngOnInit(): void {
  }

  ngOnChanges(e:SimpleChanges){
    //console.log(e);
  }

  performAction(action: any, row: any) {
    this.performGlobalAction.emit({ action, row });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue === '') {
      this.paginateData = this.allData;
    }
    else {
      this.paginateData = this.allData.filter(function (obj: any) {
        //loop through each object
        for (let column in obj) {
          //check if object value contains value you are looking for
          if (obj[column].length > 0 && obj[column].toLowerCase().includes(filterValue.toLowerCase())) {
            //add this object to the filtered array
            return obj;
          }
        }
      });
    }
    this.totalRecords = this.paginateData.length;
  }

  onSort(column: string) {
    this.sortDirection = this.sortColumn === column ? !this.sortDirection : true;
    this.sortColumn = column;

    this.paginateData.sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      if (aValue < bValue) return this.sortDirection ? -1 : 1;
      if (aValue > bValue) return this.sortDirection ? 1 : -1;
      return 0;
    });

    this.currentPage = 0;
  }

  get filteredData() {
    return this.data.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }

  /* get paginatedData() {
    const startIndex = this.currentPage * this.pageSize;
    return this.filteredData.slice(startIndex, startIndex + this.pageSize);
  } */

  get totalPages() {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }

  onPageChange() {
    if(this.data){
      this.paginateData =  this.data.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
      this.first = ((this.page-1) * this.pageSize)+1;
      this.last = ((this.page-1) * this.pageSize + this.pageSize);
    }
  }


  ngOnDestroy() {

  }
}
