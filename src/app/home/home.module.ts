import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import {HomeRoutingModule} from './home.routing.module';
import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HomeService} from './home.service';
import {InputTextModule} from 'primeng';
import {FamilyListComponent} from './family/list/family-list.component';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {PetListComponent} from './pets/list/pet-list.component';
import {PetStoreListComponent} from './pet-store/list/pet-store-list.component';
import {HouseListComponent} from './houses/list/house-list.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FamilyFormComponent} from './family/form/family-form.component';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {PetFormComponent} from './pets/form/pet-form.component';
import {RemovalReasonComponent} from './family/removal-reason/removal-reason.component';
import {TransformBirthDatePipe} from './family/family.dependencies';
import {MatSortModule} from '@angular/material/sort';
import {ReturnDataPipe} from './pets/pet.dependencies';
import {MatSelectModule} from '@angular/material/select';
import {PetStoreFormComponent} from './pet-store/form/pet-store-form.component';
import {PetStoreDetailsComponent} from './pet-store/details/pet-store-details.component';

@NgModule({
  declarations: [
    FamilyListComponent,
    HomeComponent,
    HouseListComponent,
    PetListComponent,
    PetStoreListComponent,
    FamilyFormComponent,
    PetFormComponent,
    RemovalReasonComponent,
    PetStoreFormComponent,
    PetStoreDetailsComponent,
    TransformBirthDatePipe,
    ReturnDataPipe
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSortModule,
    MatSelectModule
  ],
  providers: [

  ],
  entryComponents: [

  ]
})
export class HomeModule {
}
