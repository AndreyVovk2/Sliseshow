
import {tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {RequestService} from '../shared/services/request.service';
import {COMMON_URL} from '../shared/services/common.url';
import {Observable} from 'rxjs/Observable';
// import {HelperService} from './helper.service';

@Injectable()
export class MainPageService {

  constructor(public request: RequestService) {
  }

  getDataMainPage(): Observable<any> {
    return this.request.get(COMMON_URL.static_pages.main).pipe(
      tap((data) => {
          // console.warn('"About us" data has received.');
          // this.help.setImageUrl(data);
        },
        () => {
          console.error('"About us" error.');
        }));
  }

    updateDataMainPage(file): Promise<any> {
      const promise = new Promise<any>((resolve, reject) => {
          console.log(file);
          const { token } = JSON.parse(localStorage.getItem('currentUser'));
          const url = COMMON_URL.static_pages.main;
          const xhr = new XMLHttpRequest();
          const formData = new FormData();
          xhr.open('POST', url, true);
          xhr.setRequestHeader('Authorization', 'Bearer ' + token);
          xhr.addEventListener('readystatechange', (e) => {
              if (xhr.readyState === 4 && xhr.status === 200) {
                  // Done. Inform the user
                  resolve(xhr.responseText);
              } else if (xhr.readyState === 4 && xhr.status !== 200) {
                  // Error. Inform the user
                  console.log('Error.');
                  reject();
              }
          });

          formData.append('video_body1', file);
          xhr.send(formData);
      });
      return promise;
  }
}
