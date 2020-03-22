import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpService} from '../../../shared/services/http-service';
import {Subscription} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {IFamilyMember} from '../../family/family.dependencies';
import {IPetStore} from '../petstore.dependencies';
import {RemovalReasonComponent} from '../../family/removal-reason/removal-reason.component';
import {FamilyFormComponent} from '../../family/form/family-form.component';
import {MatDialog} from '@angular/material/dialog';
import {HomeService} from '../../home.service';
import {PetStoreFormComponent} from '../form/pet-store-form.component';
import {PetStoreDetailsComponent} from '../details/pet-store-details.component';

@Component({
  selector: 'app-pet-store-list',
  templateUrl: './pet-store-list.component.html',
  styleUrls: ['./pet-store-list.component.scss']
})
export class PetStoreListComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  storePets: IPetStore[] = [];
  displayedColumns: string[] = ['name', 'age', 'picture', 'breed', 'location', 'actions'];

  dataSource: any = new MatTableDataSource<IFamilyMember>();

  constructor(private dialog: MatDialog, private httpService: HttpService, public homeService: HomeService) {
  }

  ngOnInit(): void {
    this.subscriptions.push(this.httpService.fbGet('allowedpets').subscribe(data => {
        this.storePets = data.map(e => {
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

        this.dataSource.data = this.storePets;
      },
      error => {
        this.httpService.errorHandler(error);
      }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
  }

  remove(_StorePet: IPetStore): void {
    this.httpService.fbDelete('allowedpets', _StorePet.fbId);
  }

  edit(_StorePet: IPetStore): void {
    const dialogRef = this.dialog.open(PetStoreFormComponent, {
      width: '400px',
      data: {State: 2, Length: this.storePets.length, ID: _StorePet.fbId}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
    });

  }

  create(): void {
    const dialogRef = this.dialog.open(PetStoreFormComponent, {
      width: '400px',
      data: {State: 1, Length: this.storePets.length, ID: null}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  openDetails(_StorePet: IPetStore): void {
    const dialogRef = this.dialog.open(PetStoreDetailsComponent, {
      width: '400px',
      data: {ID: _StorePet.fbId}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
    });
  }

}
