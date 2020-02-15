
import {tap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { RequestService } from '../shared/services/request.service';
import { COMMON_URL } from '../shared/services/common.url';
import { Observable } from 'rxjs/Observable';
import {HelperService} from '../shared/services/helper.service';

@Injectable()
export class TermsAndConditionsService {

  constructor(private request: RequestService,
              private help: HelperService) { }

  getDataTermsConditions(): Observable<any> {
    return this.request.get(COMMON_URL.static_pages.terms_conditions).pipe(
      tap((data) => {
          console.warn('"Terms & Conditions" data has received.');
          // this.help.setImageUrl(data);
        },
        () => {
          console.error('"Terms & Conditions" error.');
        }));
  }
}
