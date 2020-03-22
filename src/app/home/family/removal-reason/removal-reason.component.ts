import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {HttpService} from '../../../shared/services/http-service';
import {FamilyMember, IFamilyMember} from '../family.dependencies';
import {FamilyFormComponent} from '../form/family-form.component';
import {MatTableDataSource} from '@angular/material/table';
import {HomeService} from '../../home.service';

@Component({
  selector: 'app-removal-reason',
  templateUrl: './removal-reason.component.html',
  styleUrls: ['./removal-reason.component.scss']
})
export class RemovalReasonComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  familyMember: IFamilyMember = null;
  formGroup: FormGroup;

  constructor(public homeService: HomeService, public dialogRef: MatDialogRef<RemovalReasonComponent>, private formBuilder: FormBuilder, private httpService: HttpService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.formGroup = this.formBuilder.group({
      id: [0],
      name: [null],
      surname: [null],
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
    this.subscriptions.push(this.httpService.fbGetByID('familymembers', this.data).subscribe(data => {
        if (!data) {
          return;
        }

        this.familyMember = data;
        this.fillData();
      },
      error => {
        this.httpService.errorHandler(error);
      }));
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
    this.formGroup.controls['status'].setValue(this.familyMember.status);
    this.formGroup.controls['isActive'].setValue(false);
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

    this.httpService.fbUpdate('familymembers', this.data, new FamilyMember(this.formGroup));
    this.dialogRef.close(null);
  }

}
