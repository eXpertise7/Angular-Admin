import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {HttpService} from '../../../shared/services/http-service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IPetStore, PetStore} from '../petstore.dependencies';
import {IHouse} from '../../houses/houses.dependencies';
import {House} from '../../houses/list/house-list.component';
import {IPet, Pet} from '../../pets/pet.dependencies';

@Component({
  selector: 'app-pet-store-details',
  templateUrl: './pet-store-details.component.html',
  styleUrls: ['./pet-store-details.component.scss']
})
export class PetStoreDetailsComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  petStore: IPetStore = null;

  state: number = 1;
  houses: House[] = [];
  formGroup: FormGroup;

  selectedHouse: House = null;
  ownedPets: IPet[] = [];

  warning: boolean = false;

  constructor(public dialogRef: MatDialogRef<PetStoreDetailsComponent>, private formBuilder: FormBuilder, private httpService: HttpService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.formGroup = this.formBuilder.group({
      id: [0],
      name: [null],
      breed: [null],
      age: [null],
      familyId: [null]
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(this.httpService.fbGetByID('allowedpets', this.data.ID).subscribe(data => {
        if (!data) {
          return;
        }

        this.petStore = data;
      },
      error => {
        this.httpService.errorHandler(error);
      }));

    this.subscriptions.push(this.httpService.fbGet('houses').subscribe(data => {
        this.houses = data.map(e => {
          return {
            fbId: e.payload.doc.id,
            id: e.payload.doc.data()['id'],
            surname: e.payload.doc.data()['surname'],
            Address: e.payload.doc.data()['Address'],
            currency: e.payload.doc.data()['currency'],
            prize: e.payload.doc.data()['prize']
          } as IHouse;
        });

      },
      error => {
        this.httpService.errorHandler(error);
      }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
  }

  close(): void {
    this.dialogRef.close();
  }


  addToFamily(): void {
    this.state = 2;
  }

  houseSelect(_Object: any): void {
    const houseObject = this.houses.find((house: IHouse) => {
      return house.id === _Object.value;
    });

    if (houseObject) {
      this.selectedHouse = houseObject;

      this.formGroup.controls['name'].setValue(this.petStore.name);
      this.formGroup.controls['breed'].setValue(this.petStore.breed);
      this.formGroup.controls['age'].setValue(this.petStore.age);
      this.formGroup.controls['familyId'].setValue(this.selectedHouse.id);
    }
  }

  createOwnedPet(): void {
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

        this.formGroup.controls['id'].setValue(this.ownedPets.length);

        const ownedPetsFimilyIDList = this.ownedPets.map((pet: IPet) => {
          return pet.familyId;
        }).filter(familyID => {
          return familyID === this.selectedHouse.id;
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

  /*  save(): void {
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
    }*/

}
