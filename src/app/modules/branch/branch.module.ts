import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchRoutingModule } from './branch-routing.module';
import { BranchFormComponent } from './branch-form/branch-form.component';
import { BranchListComponent } from './branch-list/branch-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTableModule } from '../../core/shared/data-table/data-table.module';
const modules = [BranchFormComponent, BranchListComponent];

@NgModule({
  declarations: [...modules],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BranchRoutingModule,
    NgbPaginationModule,
    DataTableModule
  ],
  exports: [...modules]
})
export class BranchModule { }
