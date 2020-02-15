
import {tap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { RequestService } from '../shared/services/request.service';
import { COMMON_URL } from '../shared/services/common.url';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FaqService {

  constructor(public request: RequestService) { }

  getAllFaqRecords(): Observable<any> {
    return this.request.get(COMMON_URL.faq.all).pipe(
      tap(() => {
          console.warn('"All FAQ records" data has received.');
        },
        () => {
          console.error('"All FAQ records" error.');
        }));
  }

  getOneFaqRecord(id: number): Observable<any> {
    return this.request.get(`${COMMON_URL.faq.one}${id}`).pipe(
      tap(() => {
          console.warn('"One FAQ record" data has received.');
        },
        () => {
          console.error('"One FAQ record" error.');
        }));
  }

  getFaqStatic(): Observable<any> {
    return this.request.get(`${COMMON_URL.static_pages.faq}`).pipe(
      tap((data) => {
          console.warn('"FAQ static" data has received.');
          // this.help.setImageUrl(data);
        },
        () => {
          console.error('"FAQ static" error.');
        }));
  }

}
