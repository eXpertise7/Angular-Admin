import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {HttpService} from '../../../shared/services/http-service';
import {MatTableDataSource} from '@angular/material/table';
import {IPet} from '../pet.dependencies';
import {MatDialog} from '@angular/material/dialog';
import {PetFormComponent} from '../form/pet-form.component';
import {HomeService} from '../../home.service';
import {FamilyMember, IFamilyMember} from '../../family/family.dependencies';
import {MatSort} from '@angular/material/sort';
import {IHouse} from '../../houses/houses.dependencies';

@Component({
  selector: 'app-pet-list',
  templateUrl: './pet-list.component.html',
  styleUrls: ['./pet-list.component.scss']
})
export class PetListComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  subscriptions: Subscription[] = [];

  pets: IPet[] = [];
  houses: IHouse[] = [];
  displayedColumns: string[] = ['id', 'name', 'breed', 'age', 'familyId', 'actions'];

  dataSource: any = new MatTableDataSource<IPet>();

  constructor(private dialog: MatDialog, private httpService: HttpService, public homeService: HomeService) {

  }

  ngOnInit(): void {
    this.subscriptions.push(this.httpService.fbGet('ownedpets').subscribe(data => {
        this.pets = data.map(e => {
          return {
            fbId: e.payload.doc.id,
            id: e.payload.doc.data()['id'],
            name: e.payload.doc.data()['name'],
            breed: e.payload.doc.data()['breed'],
            age: e.payload.doc.data()['age'],
            familyId: e.payload.doc.data()['familyId'],
          } as IPet;
        });

        this.dataSource.data = this.pets;

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

  remove(_Pet: IPet): void {
    this.httpService.fbDelete('ownedpets', _Pet.fbId);
  }

  edit(_Pet: IPet): void {
    const dialogRef = this.dialog.open(PetFormComponent, {
      width: '400px',
      data: {State: 2, Length: this.pets.length, ID: _Pet.fbId}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
    });

  }

  create(): void {
    const dialogRef = this.dialog.open(PetFormComponent, {
      width: '400px',
      data: {State: 1, Length: this.pets.length, ID: null}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

    });


  }

}

