import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../auth/guards/auth.guard';
import { BranchListComponent } from './branch-list/branch-list.component';
import { BranchFormComponent } from './branch-form/branch-form.component';

const routes: Routes = [
  { path: '', component: BranchListComponent, pathMatch: 'full' },
  { path: 'create', component: BranchFormComponent, pathMatch: 'full', canActivate: [authGuard] },
  { path: 'edit/:id', component: BranchFormComponent, pathMatch: 'full', canActivate: [authGuard] },
  { path: 'list', component: BranchListComponent, pathMatch: 'full', canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchRoutingModule { }
