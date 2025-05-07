import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShedListComponent } from './shed-list/shed-list.component';
import { authGuard } from '../auth/guards/auth.guard';
import { ShedFormComponent } from './shed-form/shed-form.component';

const routes: Routes = [
  { path: '', component: ShedListComponent, pathMatch: 'full' },
  { path: 'create', component: ShedFormComponent, pathMatch: 'full', canActivate: [authGuard] },
  { path: 'edit/:id', component: ShedFormComponent, pathMatch: 'full', canActivate: [authGuard] },
  { path: 'list', component: ShedListComponent, pathMatch: 'full', canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShedRoutingModule { }
