import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {FamilyListComponent} from './home/family/list/family-list.component';
import {ErrorComponent} from './system/404/error.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home/family',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(mod => mod.HomeModule)
  },
  {
    path: 'error',
    component: ErrorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
