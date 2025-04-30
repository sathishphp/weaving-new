import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { PermissionModule } from '../permission/permission.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertService } from './alert.service';
import { LoaderComponent } from './components/loader/loader.component';
import { CommonComponent } from './components/country-company-branch/common.component';
import { DataTablesModule } from "angular-datatables";
import { NgSelectModule } from '@ng-select/ng-select';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { LoadingComponent } from './components/loading/loading.component';

const modules = [
  PermissionModule,
  ReactiveFormsModule,
  FormsModule,
  DataTablesModule,
  NgSelectModule,
  SweetAlert2Module
];
const components = [ConfirmationComponent,LoaderComponent,LoadingComponent,CommonComponent];

@NgModule({
  declarations: [
    ConfirmationComponent,
    LoaderComponent,
    LoadingComponent,
    CommonComponent
  ],
  imports: [CommonModule,...modules],
  providers: [AlertService],
  exports: [...modules,...components]
})
export class SharedAppModule { }
