import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyRoutingModule } from './company-routing.module';
import { CompanyFormComponent } from './company-form/company-form.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyService } from './_services/company.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTableModule } from '../../core/shared/data-table/data-table.module';
const modules = [CompanyFormComponent,CompanyListComponent]

@NgModule({
  declarations: [...modules],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CompanyRoutingModule,
    NgbPaginationModule,
    DataTableModule
  ],
  exports:[...modules],
  providers:[CompanyService]
})
export class CompanyModule { }
