import {Component, HostListener, OnDestroy, OnInit, Pipe, PipeTransform, ViewChild} from '@angular/core';
import {HomeService} from '../../home.service';
import {Subscription} from 'rxjs';
import {MenuItem} from 'primeng/api';
import {HttpService} from '../../../shared/services/http-service';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {FamilyFormComponent} from '../form/family-form.component';
import {IFamilyMember} from '../family.dependencies';
import {RemovalReasonComponent} from '../removal-reason/removal-reason.component';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-family-list',
  templateUrl: './family-list.component.html',
  styleUrls: ['./family-list.component.scss']
})
export class FamilyListComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  subscriptions: Subscription[] = [];

  familyMembers: IFamilyMember[] = [];
  displayedColumns: string[] = ['id', 'name', 'surname', 'birthday', 'school', 'work', 'status', 'actions'];

  dataSource: any = new MatTableDataSource<IFamilyMember>();

  constructor(private dialog: MatDialog, private httpService: HttpService, public homeService: HomeService) {
  }

  ngOnInit(): void {
    this.subscriptions.push(this.httpService.fbGet('familymembers').subscribe(data => {
        this.familyMembers = data.map(e => {
          return {
            fbId: e.payload.doc.id,
            id: e.payload.doc.data()['id'],
            name: e.payload.doc.data()['name'],
            surname: e.payload.doc.data()['surname'],
            birthday: e.payload.doc.data()['birthday'],
            isActive: e.payload.doc.data()['isActive'],
            school: e.payload.doc.data()['school'],
            work: e.payload.doc.data()['work'],
            status: e.payload.doc.data()['status'],
            houseId: e.payload.doc.data()['houseId'],
            familyId: e.payload.doc.data()['familyId'],
            reasonOfRemoval: e.payload.doc.data()['reasonOfRemoval']
          } as IFamilyMember;
        });

        this.dataSource.data = this.familyMembers.filter((familyMember: IFamilyMember) => {
          return familyMember.isActive === true;
        });
        this.dataSource.sort = this.sort;
      },
      error => {
        this.httpService.errorHandler(error);
      }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
  }

  remove(_FamilyMember: IFamilyMember): void {
    const dialogRef = this.dialog.open(RemovalReasonComponent, {
      width: '400px',
      data: _FamilyMember.fbId
    });
    dialogRef.afterClosed().subscribe((result: IFamilyMember) => {
      if (!result) {
        return;
      }
    });

  }

  edit(_FamilyMember: IFamilyMember): void {
    const dialogRef = this.dialog.open(FamilyFormComponent, {
      width: '400px',
      data: {State: 2, Length: this.familyMembers.length, ID: _FamilyMember.fbId}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
    });

  }

  create(): void {
    const dialogRef = this.dialog.open(FamilyFormComponent, {
      width: '400px',
      data: {State: 1, Length: this.familyMembers.length, ID: null}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
    });
  }
}

