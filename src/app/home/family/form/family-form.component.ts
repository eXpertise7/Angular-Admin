import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {HttpService} from '../../../shared/services/http-service';
import {FamilyMember, IFamilyMember} from '../family.dependencies';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-family-form',
  templateUrl: './family-form.component.html',
  styleUrls: ['./family-form.component.scss']
})
export class FamilyFormComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  familyMember: IFamilyMember = null;
  formGroup: FormGroup;

  constructor(public dialogRef: MatDialogRef<FamilyFormComponent>, private formBuilder: FormBuilder, private httpService: HttpService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.formGroup = this.formBuilder.group({
      id: [0],
      name: [null, Validators.required],
      surname: [null, Validators.required],
      birthday: [null],
      school: [null],
      work: [false],
      status: [null],
      houseId: [null],
      familyId: [null],
      reasonOfRemoval: [null],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    if (this.data.State === 2) {
      this.subscriptions.push(this.httpService.fbGetByID('familymembers', this.data.ID).subscribe(data => {
          if (!data) {
            return;
          }

          this.familyMember = data;
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
    this.formGroup.controls['id'].setValue(this.familyMember.id);
    this.formGroup.controls['name'].setValue(this.familyMember.name);
    this.formGroup.controls['surname'].setValue(this.familyMember.surname);
    this.formGroup.controls['birthday'].setValue(this.familyMember.birthday);
    this.formGroup.controls['school'].setValue(this.familyMember.school);
    this.formGroup.controls['work'].setValue(this.familyMember.work);
    this.formGroup.controls['isActive'].setValue(this.familyMember.isActive);
    this.formGroup.controls['status'].setValue(this.familyMember.status);
    this.formGroup.controls['houseId'].setValue(this.familyMember.houseId);
    this.formGroup.controls['familyId'].setValue(this.familyMember.familyId);
    this.formGroup.controls['reasonOfRemoval'].setValue(this.familyMember.reasonOfRemoval);
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.formGroup.invalid) {
      return;
    }

    this.httpService.fbUpdate('familymembers', this.data.ID, new FamilyMember(this.formGroup));
    this.dialogRef.close(null);
  }

  create(): void {
    if (this.formGroup.invalid) {
      return;
    }

    this.httpService.fbCreate('familymembers', new FamilyMember(this.formGroup));
    this.dialogRef.close(null);
  }

}
