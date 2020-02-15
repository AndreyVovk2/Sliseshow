
import {tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {RequestService} from '../shared/services/request.service';
import {COMMON_URL} from '../shared/services/common.url';
import {Observable} from 'rxjs';


@Injectable()
export class HowItWorksService {

  constructor(public request: RequestService) {}

  getDataHowItWorks(): Observable<any> {
    return this.request.get(COMMON_URL.static_pages.how_it_works).pipe(
      tap((data) => {
          console.warn('"How it works" data has received.');
          // this.help.setImageUrl(data);
        },
        () => {
          console.error('"How it works" error.');
        }));
  }
}
