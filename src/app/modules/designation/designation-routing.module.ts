import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DesignationListComponent } from './designation-list/designation-list.component';
import { DesignationFormComponent } from './designation-form/designation-form.component';
import { authGuard } from '../auth/guards/auth.guard';

const routes: Routes = [
  { path: '', component: DesignationListComponent, pathMatch: 'full' },
  { path: 'create', component: DesignationFormComponent, pathMatch: 'full', canActivate: [authGuard] },
  { path: 'edit/:id', component: DesignationFormComponent, pathMatch: 'full', canActivate: [authGuard] },
  { path: 'list', component: DesignationListComponent, pathMatch: 'full', canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesignationRoutingModule { }
