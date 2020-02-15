
import {tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {RequestService} from '../shared/services/request.service';
import {COMMON_URL} from '../shared/services/common.url';
import {Observable} from 'rxjs/Observable';
import {HelperService} from '../shared/services/helper.service';

@Injectable()
export class AboutUsService {

  constructor(public request: RequestService,
              public help: HelperService) {
  }

  getDataAboutUs(): Observable<any> {
    return this.request.get(COMMON_URL.static_pages.about_us).pipe(
      tap((data) => {
          // console.warn('"About us" data has received.');
          // this.help.setImageUrl(data);
        },
        () => {
          console.error('"About us" error.');
        }));
  }
}
