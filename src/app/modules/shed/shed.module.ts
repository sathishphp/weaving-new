import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShedRoutingModule } from './shed-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTableModule } from '../../core/shared/data-table/data-table.module';
import { ShedFormComponent } from './shed-form/shed-form.component';
import { ShedListComponent } from './shed-list/shed-list.component';
import { NgSelectModule } from '@ng-select/ng-select';

const components = [ShedFormComponent,ShedListComponent];

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ShedRoutingModule,
    NgbPaginationModule,
    DataTableModule,
    NgSelectModule
  ],
  exports:[...components]
})
export class ShedModule { }
