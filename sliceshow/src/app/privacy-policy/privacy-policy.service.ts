
import {tap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { RequestService } from '../shared/services/request.service';
import { COMMON_URL } from '../shared/services/common.url';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PrivacyPolicyService {

  constructor(public request: RequestService) { }

  getDataPrivacyPolicy(): Observable<any> {
    return this.request.get(COMMON_URL.static_pages.privacy_policy).pipe(
      tap((data) => {
          console.warn('"Privacy policy" data has received.');
          // this.help.setImageUrl(data);

        },
        () => {
          console.error('"Privacy policy" error.');
        }));
  }
}
