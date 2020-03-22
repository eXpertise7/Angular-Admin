import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home.component';
import {NgModule} from '@angular/core';
import {FamilyListComponent} from './family/list/family-list.component';
import {HouseListComponent} from './houses/list/house-list.component';
import {PetStoreListComponent} from './pet-store/list/pet-store-list.component';
import {PetListComponent} from './pets/list/pet-list.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'family',
        component: FamilyListComponent
      },
      {
        path: 'houses',
        component: HouseListComponent
      },
      {
        path: 'petstore',
        component: PetStoreListComponent
      },
      {
        path: 'pets',
        component: PetListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}
