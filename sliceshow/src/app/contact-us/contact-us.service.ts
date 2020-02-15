
import {tap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { RequestService } from '../shared/services/request.service';
import { COMMON_URL } from '../shared/services/common.url';
import { Observable } from 'rxjs/Observable';
import {HelperService} from '../shared/services/helper.service';

@Injectable()
export class ContactUsService {

  constructor(public request: RequestService,
              public help: HelperService) { }

  getContactUs(): Observable<any> {
    return this.request.get(COMMON_URL.static_pages.contact_us).pipe(
      tap((data) => {
          console.warn('"Contact Us" data has received.');
          // this.help.setImageUrl(data);
        },
        () => {
          console.error('"Contact us" error.');
        }));
  }
}

