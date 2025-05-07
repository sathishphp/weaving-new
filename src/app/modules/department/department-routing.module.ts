import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentListComponent } from './department-list/department-list.component';
import { authGuard } from '../auth/guards/auth.guard';
import { DepartmentFormComponent } from './department-form/department-form.component';

const routes: Routes = [
  { path: '', component: DepartmentListComponent, pathMatch: 'full' },
  { path: 'create', component: DepartmentFormComponent, pathMatch: 'full', canActivate: [authGuard] },
  { path: 'edit/:id', component: DepartmentFormComponent, pathMatch: 'full', canActivate: [authGuard] },
  { path: 'list', component: DepartmentListComponent, pathMatch: 'full', canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentRoutingModule { }
