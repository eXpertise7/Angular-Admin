import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {HttpService} from '../../../shared/services/http-service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Pet, IPet} from '../pet.dependencies';
import {FamilyMember} from '../../family/family.dependencies';
import {IPetStore} from '../../pet-store/petstore.dependencies';

@Component({
  selector: 'app-pet-form',
  templateUrl: './pet-form.component.html',
  styleUrls: ['./pet-form.component.scss']
})
export class PetFormComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  pet: IPet = null;
  formGroup: FormGroup;

  ownedPets: IPet[] = [];
  petStoreList: IPetStore[] = [];

  warning: boolean = false;

  constructor(public dialogRef: MatDialogRef<PetFormComponent>, private formBuilder: FormBuilder, private httpService: HttpService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.formGroup = this.formBuilder.group({
      id: [0],
      name: [null],
      breed: [null],
      age: [null],
      familyId: [null]
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(this.httpService.fbGet('allowedpets').subscribe(data => {
        if (!data) {
          return;
        }

        this.petStoreList = data.map(e => {
          return {
            fbId: e.payload.doc.id,
            id: e.payload.doc.data()['id'],
            age: e.payload.doc.data()['age'],
            picture: e.payload.doc.data()['picture'],
            breed: e.payload.doc.data()['breed'],
            name: e.payload.doc.data()['name'],
            location: e.payload.doc.data()['location']
          } as IPetStore;
        });

        this.initialize();
      },
      error => {
        this.httpService.errorHandler(error);
      }));
  }

  initialize(): void {
    if (this.data.State === 2) {
      this.subscriptions.push(this.httpService.fbGetByID('ownedpets', this.data.ID).subscribe(data => {
          if (!data) {
            return;
          }

          this.pet = data;
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
    this.formGroup.controls['id'].setValue(this.pet.id);
    this.formGroup.controls['name'].setValue(this.pet.name);
    this.formGroup.controls['breed'].setValue(this.pet.breed);
    this.formGroup.controls['age'].setValue(this.pet.age);
    this.formGroup.controls['familyId'].setValue(this.pet.familyId);
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.formGroup.invalid) {
      return;
    }

    this.subscriptions.push(this.httpService.fbGet('ownedpets').subscribe(data => {
        this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
        if (!data) {
          return;
        }

        this.ownedPets = data.map(e => {
          return {
            fbId: e.payload.doc.id,
            id: e.payload.doc.data()['id'],
            name: e.payload.doc.data()['name'],
            breed: e.payload.doc.data()['breed'],
            age: e.payload.doc.data()['age'],
            familyId: e.payload.doc.data()['familyId'],
          } as IPet;
        });

        const ownedPetsFimilyIDList = this.ownedPets.map((pet: IPet) => {
          return pet.familyId;
        }).filter(familyID => {
          return familyID === this.formGroup.value.familyId;
        });

        if (ownedPetsFimilyIDList.length >= 2) {
          this.warning = true;
        } else {
          this.httpService.fbUpdate('ownedpets', this.data.ID, new Pet(this.formGroup));
          this.dialogRef.close(null);
        }
      },
      error => {
        this.httpService.errorHandler(error);
      }));
  }

  create(): void {
    if (this.formGroup.invalid) {
      return;
    }

    this.subscriptions.push(this.httpService.fbGet('ownedpets').subscribe(data => {
        this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
        if (!data) {
          return;
        }

        this.ownedPets = data.map(e => {
          return {
            fbId: e.payload.doc.id,
            id: e.payload.doc.data()['id'],
            name: e.payload.doc.data()['name'],
            breed: e.payload.doc.data()['breed'],
            age: e.payload.doc.data()['age'],
            familyId: e.payload.doc.data()['familyId'],
          } as IPet;
        });

        const ownedPetsFimilyIDList = this.ownedPets.map((pet: IPet) => {
          return pet.familyId;
        }).filter(familyID => {
          return familyID === this.formGroup.value.familyId;
        });

        if (ownedPetsFimilyIDList.length >= 2) {
          this.warning = true;
        } else {
          this.httpService.fbCreate('ownedpets', new Pet(this.formGroup));
          this.dialogRef.close(null);
        }
      },
      error => {
        this.httpService.errorHandler(error);
      }));


  }

  petSelect(_Object: any): void {
    const storePet = this.petStoreList.find((pet: IPetStore) => {
      return pet.id === _Object.value;
    });

    if (storePet) {
      this.formGroup.controls['name'].setValue(storePet.name);
      this.formGroup.controls['breed'].setValue(storePet.breed);
      this.formGroup.controls['age'].setValue(storePet.age);
    }
  }

}
