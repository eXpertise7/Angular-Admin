import moment from 'moment';
import {Pipe, PipeTransform} from '@angular/core';

export interface IFamilyMember {
  fbId: string;
  id: number;
  name: string;
  surname: string;
  birthday: string;
  school: string;
  work: boolean;
  status: string;
  houseId: number;
  familyId: number;
  reasonOfRemoval: string;
  isActive: boolean;
}

export class FamilyMember implements IFamilyMember {
  fbId: string;
  id: number;
  name: string;
  surname: string;
  birthday: string;
  school: string;
  work: boolean;
  status: string;
  houseId: number;
  familyId: number;
  reasonOfRemoval: string;
  isActive: boolean;

  constructor(_FamilyForm: any) {
    this.id = _FamilyForm.value.id;
    this.name = _FamilyForm.value.name;
    this.surname = _FamilyForm.value.surname;
    this.birthday = _FamilyForm.value.birthday !== null ? moment(new Date(_FamilyForm.value.birthday)).format('YYYY-MM-DD') : null;
    this.school = _FamilyForm.value.school;
    this.work = _FamilyForm.value.work;
    this.status = _FamilyForm.value.status;
    this.houseId = _FamilyForm.value.houseId;
    this.familyId = _FamilyForm.value.familyId;
    this.reasonOfRemoval = _FamilyForm.value.reasonOfRemoval;
    this.isActive = _FamilyForm.value.isActive;
  }
}

@Pipe({
  name: 'transformBirthDate',
  pure: true
})

export class TransformBirthDatePipe implements PipeTransform {

  constructor() { }

  transform(_Date: string): any {

    if (!_Date) {
      return '';
    }

    return moment().diff(new Date(_Date), 'years');
  }
}
