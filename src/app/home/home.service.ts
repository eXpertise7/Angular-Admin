import {Injectable} from '@angular/core';
import {faEdit, faPlus, faTrash} from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  icons: {Edit: any, Create: any, Delete: any} = {
    Edit: faEdit,
    Create: faPlus,
    Delete: faTrash
  };

  constructor() {}

}
