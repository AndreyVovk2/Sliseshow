
import {tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {RequestService} from '../shared/services/request.service';
import {COMMON_URL} from '../shared/services/common.url';
import {Observable} from 'rxjs/Observable';
import {HelperService} from '../shared/services/helper.service';

@Injectable()
export class PricingService {



  constructor(public request: RequestService,
              public help: HelperService) {
  }

  getTariffs(): Observable<any> {
    return this.request.get(COMMON_URL.pricing.all).pipe(
      tap((data) => {
          // console.warn('"Tariffs" data has received.');
          // this.help.setImageUrl(data);
        },
        () => {
          console.error('"Tariffs" error.');
        }));
  }

  getOneTariff(id: number): Observable<any> {
    return this.request.get(`${COMMON_URL.pricing.one}${id}`).pipe(
      tap((data) => {
          console.warn('"One tariff" data has received.');
          // this.help.setImageUrl(data);
        },
        () => {
          console.error('"One tariff" error.');
        }));
  }

  getStaticPricing(): Observable<any> {
    return this.request.get(`${COMMON_URL.static_pages.pricing}`).pipe(
      tap((data) => {
          console.warn('"Static pricing" data has received.');
          // this.help.setImageUrl(data);
        },
        () => {
          console.error('"Static pricing" error.');
        }));
  }
}
