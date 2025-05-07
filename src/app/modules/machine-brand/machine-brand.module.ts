import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MachineBrandRoutingModule } from './machine-brand-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTableModule } from '../../core/shared/data-table/data-table.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { MachineBrandFormComponent } from './machine-brand-form/machine-brand-form.component';
import { MachineBrandListComponent } from './machine-brand-list/machine-brand-list.component';
const components = [MachineBrandFormComponent, MachineBrandListComponent]

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    MachineBrandRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbPaginationModule,
    DataTableModule,
    NgSelectModule
  ],
  exports: [...components]
})
export class MachineBrandModule { }
