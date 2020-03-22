import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {HttpService} from '../../../shared/services/http-service';
import {IHouse} from '../houses.dependencies';

@Component({
  selector: 'app-house-list',
  templateUrl: './house-list.component.html',
  styleUrls: ['./house-list.component.scss']
})
export class HouseListComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  houses: House[] = [];
  displayedColumns: string[] = ['surname', 'Address', 'prize'];

  constructor(private httpService: HttpService) {
  }

  ngOnInit(): void {
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

}

export interface House {
  id: number;
  surname: string;
  Address: string;
  prize: number;
  currency: string;
}
