import moment from 'moment';

export interface IPetStore {
  fbId: string;
  id: number;
  name: string;
  breed: string;
  picture: string;
  age: number;
  location: number;
}

export class PetStore implements IPetStore {
  fbId: string;
  id: number;
  name: string;
  breed: string;
  picture: string;
  age: number;
  location: number;

  constructor(_FamilyForm: any) {
    this.id = _FamilyForm.value.id;
    this.name = _FamilyForm.value.name;
    this.breed = _FamilyForm.value.breed;
    this.picture = _FamilyForm.value.picture;
    this.age = _FamilyForm.value.age;
    this.location = _FamilyForm.value.location;
  }
}
