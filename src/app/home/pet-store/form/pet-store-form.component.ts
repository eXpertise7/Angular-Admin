import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {HttpService} from '../../../shared/services/http-service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IPetStore, PetStore} from '../petstore.dependencies';

@Component({
  selector: 'app-pet-store-form',
  templateUrl: './pet-store-form.component.html',
  styleUrls: ['./pet-store-form.component.scss']
})
export class PetStoreFormComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  petStore: IPetStore = null;
  formGroup: FormGroup;

  constructor(public dialogRef: MatDialogRef<PetStoreFormComponent>, private formBuilder: FormBuilder, private httpService: HttpService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.formGroup = this.formBuilder.group({
      id: [0],
      name: [null, Validators.required],
      breed: [null],
      picture: [null],
      age: [null],
      location: [null]
    });
  }

  ngOnInit(): void {
    if (this.data.State === 2) {
      this.subscriptions.push(this.httpService.fbGetByID('allowedpets', this.data.ID).subscribe(data => {
          if (!data) {
            return;
          }

          this.petStore = data;
          this.fillData();
        },
        error => {
          this.httpService.errorHandler(error);
        }));
    } else {
      this.formGroup.controls['id'].setValue(this.data.Length);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
  }

  fillData(): void {
    this.formGroup.controls['id'].setValue(this.petStore.id);
    this.formGroup.controls['name'].setValue(this.petStore.name);
    this.formGroup.controls['breed'].setValue(this.petStore.breed);
    this.formGroup.controls['picture'].setValue(this.petStore.picture);
    this.formGroup.controls['age'].setValue(this.petStore.age);
    this.formGroup.controls['location'].setValue(this.petStore.location);
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.formGroup.invalid) {
      return;
    }

    this.httpService.fbUpdate('allowedpets', this.data.ID, new PetStore(this.formGroup));
    this.dialogRef.close(null);
  }

  create(): void {
    if (this.formGroup.invalid) {
      return;
    }

    this.httpService.fbCreate('allowedpets', new PetStore(this.formGroup));
    this.dialogRef.close(null);
  }

}
