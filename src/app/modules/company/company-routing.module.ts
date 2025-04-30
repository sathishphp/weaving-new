import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyListComponent } from './company-list/company-list.component';
import { CompanyFormComponent } from './company-form/company-form.component';
import { authGuard } from '../auth/guards/auth.guard';

const routes: Routes = [
  {path:'',component:CompanyListComponent,pathMatch:'full'},
  {path:'create',component:CompanyFormComponent,pathMatch:'full',canActivate:[authGuard]},
  {path:'edit/:id',component:CompanyFormComponent,pathMatch:'full',canActivate:[authGuard]},
  {path:'list',component:CompanyListComponent,pathMatch:'full',canActivate:[authGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
