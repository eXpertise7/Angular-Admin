import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  address: string = 'https://my-json-server.typicode.com/jbuzimkic/simsDemo/';

  constructor(private firestore: AngularFirestore, private httpClient: HttpClient, private router: Router) {

  }

  // REGION HTTP servisi za POST i PUT

  public postService(_RequestObject: any, _Url: string): Observable<any> {
    return this.httpClient.post(this.address + _Url, _RequestObject).pipe(
      catchError(((error) => {
        this.errorHandler(error, _Url);
        return Observable.throw(error.json().error);
      })));
  }

  public putService(_RequestObject: any, _Url: string): Observable<any> {
    return this.httpClient.put(this.address + _Url, _RequestObject).pipe(
      catchError(((error) => {
        this.errorHandler(error, _Url);
        return Observable.throw(error.json().error);
      })));
  }

  public getService(_Url: string): Observable<any> {
    return this.httpClient.get<any>(this.address + _Url);
  }

  public deleteService(_ID: any, _Url: string): Observable<any> {
    return this.httpClient.delete<any>(this.address + _Url + '/' + _ID);
  }


  // REGION HTTP FIREBASE requests

  public fbGet(_Table: string): Observable<any> {
    return this.firestore.collection(_Table)
      .snapshotChanges();
  }

  public fbGetByID(_Table: string, _ID: string): Observable<any> {
    return this.firestore.collection(_Table)
      .doc(_ID)
      .valueChanges();
  }

  public fbCreate(_Table: string, _Value: any): any {
    return this.firestore.collection(_Table)
      .add(JSON.parse(JSON.stringify(_Value)));
  }

  public fbUpdate(_Table: string, _ID: string, _Value: any): any {
    return this.firestore.doc(_Table + '/' + _ID)
      .update(JSON.parse(JSON.stringify(_Value)));
  }

  public fbDelete(_Table: string, _ID: string): any {
    return this.firestore.doc(_Table + '/' + _ID)
      .delete();
  }


  errorHandler(_Error: any, _Url?: string): void {

    switch (_Error.status) {
      case 403: {
        this.router.navigate(['error']);
        break;
      }
      case 404: {
        this.router.navigate(['error']);
        break;
      }
      default: {
        this.router.navigate(['error']);
        break;
      }

    }

  }
}
