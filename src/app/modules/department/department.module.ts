import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentRoutingModule } from './department-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTableModule } from '../../core/shared/data-table/data-table.module';
import { DepartmentFormComponent } from './department-form/department-form.component';
import { DepartmentListComponent } from './department-list/department-list.component';

const components = [DepartmentFormComponent, DepartmentListComponent]
@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    DepartmentRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbPaginationModule,
    DataTableModule
  ],
  exports: [...components]
})
export class DepartmentModule { }
