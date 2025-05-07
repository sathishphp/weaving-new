import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MachineBrandListComponent } from './machine-brand-list/machine-brand-list.component';
import { authGuard } from '../auth/guards/auth.guard';
import { MachineBrandFormComponent } from './machine-brand-form/machine-brand-form.component';

const routes: Routes = [
  { path: '', component: MachineBrandListComponent, pathMatch: 'full' },
  { path: 'create', component: MachineBrandFormComponent, pathMatch: 'full', canActivate: [authGuard] },
  { path: 'edit/:id', component: MachineBrandFormComponent, pathMatch: 'full', canActivate: [authGuard] },
  { path: 'list', component: MachineBrandListComponent, pathMatch: 'full', canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MachineBrandRoutingModule { }
