import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesignationRoutingModule } from './designation-routing.module';
import { DesignationFormComponent } from './designation-form/designation-form.component';
import { DesignationListComponent } from './designation-list/designation-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTableModule } from '../../core/shared/data-table/data-table.module';
import { NgSelectModule } from '@ng-select/ng-select';

const components = [DesignationFormComponent, DesignationListComponent]
@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    DesignationRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbPaginationModule,
    DataTableModule,
    NgSelectModule
  ],
  exports: [...components]
})
export class DesignationModule { }
