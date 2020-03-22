import {Pipe, PipeTransform} from '@angular/core';
import moment from 'moment';

export interface IPet {
  fbId: string;
  id: number;
  name: string;
  breed: string;
  age: number;
  familyId: number;
}

export class Pet implements IPet {
  fbId: string;
  id: number;
  name: string;
  breed: string;
  age: number;
  familyId: number;

  constructor(_PetForm: any) {
    this.fbId = _PetForm.value.fbId;
    this.id = _PetForm.value.id;
    this.name = _PetForm.value.name;
    this.breed = _PetForm.value.breed;
    this.age = _PetForm.value.age;
    this.familyId = _PetForm.value.familyId;
  }
}

@Pipe({
  name: 'returnData',
  pure: true
})
export class ReturnDataPipe implements PipeTransform {

  transform(_List: any[], _ID: number, _ReturnProperty: string, _CompareProperty: string = null): any {

    let lassie = '';

    if (!_List) {
      return lassie;
    }

    if (_List.length < 1) {
      return lassie;
    }

    let tmpIndex = -1;
    if (_CompareProperty) {
      tmpIndex = _List.findIndex((item: any) => {
        return item[_CompareProperty] === _ID;
      });
    } else {
      tmpIndex = _List.findIndex((item: any) => {
        return item.ID === _ID;
      });
    }

    if (tmpIndex !== -1) {
      lassie = _List[tmpIndex][_ReturnProperty];
    }


    return lassie;
  }

}
