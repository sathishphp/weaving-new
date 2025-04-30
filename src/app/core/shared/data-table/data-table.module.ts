import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbdSortableHeader } from './sortable.directive';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { DataTableComponent } from './data-table.component';



@NgModule({
  declarations: [DataTableComponent],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule, 
    HttpClientModule, 
    NgbModule,
    NgbPagination
  ],
  exports:[DataTableComponent]
})
export class DataTableModule { }
