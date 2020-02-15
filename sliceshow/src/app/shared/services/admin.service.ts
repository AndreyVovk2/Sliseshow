import {tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {RequestService} from './request.service';
import {COMMON_URL} from './common.url';
import {Observable} from 'rxjs/Observable';
import {HelperService} from './helper.service';
import {EventEmitter} from '@angular/core';
import {RouteConfigLoadEnd} from '@angular/router';
import {HttpParams} from '@angular/common/http';

@Injectable()
export class AdminService {

  updateSliceEvent = new EventEmitter<any>();

  constructor(public request: RequestService,
              public help: HelperService) {
  }

  GetTranslateHe(): Observable<any> {
    return this.request.get(COMMON_URL.admin.update + '/ContactUs.YourTel').pipe(
      tap(() => {
          // console.log('Update translate is ok.');
        },
        () => {
          console.error('"All categories" error.');
        })
    );
  }

  GetTranslateEn(): Observable<any> {
    return this.request.get(COMMON_URL.admin.update + '/ContactUs.YourAddress').pipe(
      tap(() => {
          // console.log('Update translate is ok.');
        },
        () => {
          console.error('"All categories" error.');
        }));
  }

  updateTranslate(data): Observable<any> {
    return this.request.post(COMMON_URL.admin.update, data).pipe(
      tap(() => {
          // console.log('Update translate is ok.');
        },
        () => {
          console.error('"All categories" error.');
        }));
  }

  getTranslate(id: string): Observable<any> {
    console.log(id);
    return this.request.get(`${COMMON_URL.admin.update}/${id}`).pipe(
      tap(() => {
          console.log('Get translate is ok.');
        },
        () => {
          console.error('"Get translate" error.');
        }));
  }


  uploadPhoto(file, fileId, pageId): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
      console.log(file);
      const {token} = JSON.parse(localStorage.getItem('currentUser'));
      const url = `${COMMON_URL.static_pages.main}`;
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      xhr.responseType = 'json';
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.addEventListener('readystatechange', (e) => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          // Done. Inform the user
          resolve(xhr.response);

        } else if (xhr.readyState === 4 && xhr.status !== 200) {
          // Error. Inform the user
          console.log('Error.');
          reject();
        }
      });

      formData.append(fileId, file);
      xhr.send(formData);
    });
    return promise;
  }

  getEditSlice(id: number): Observable<any> {
    return this.request.get(`${COMMON_URL.pricing.one}${id}`).pipe(
      tap((data) => {
          console.warn('"About us" data has received.');
          // this.help.setImageUrl(data);
        },
        () => {
          console.error('"About us" error.');
        }));
  }

// updateSlice(slice: any, id: number): Observable<any> {
//   return this.request.post(`${COMMON_URL.pricing.one}${id}`, slice)
//     .do((data) => {
//         console.warn('"About us" data has received.');
//         // this.help.setImageUrl(data);
//       },
//       () => {
//         console.error('"About us" error.');
//       });
// }

  updateSlice(slice, id): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
      console.log(slice);
      const {token} = JSON.parse(localStorage.getItem('currentUser'));
      const url = `${COMMON_URL.pricing.one}${id}`;
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      xhr.responseType = 'json';
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.addEventListener('readystatechange', (e) => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          // Done. Inform the user
          this.updateSliceEvent.emit();
          resolve(xhr.response);

        } else if (xhr.readyState === 4 && xhr.status !== 200) {
          // Error. Inform the user
          console.log('Error.');
          reject();
        }
      });

      formData.append('design_style', slice.design_style);
      formData.append('video_quality', slice.video_quality);
      formData.append('max_pictures', slice.max_pictures);
      formData.append('max_songs', slice.max_songs);
      formData.append('max_video_length', slice.max_video_length);
      formData.append('max_videos', slice.max_videos);
      formData.append('min_pictures', slice.min_pictures);
      formData.append('min_songs', slice.min_songs);
      formData.append('min_video_length', slice.min_video_length);
      formData.append('min_videos', slice.min_videos);
      formData.append('price', slice.price);
      formData.append('save', slice.save);
      formData.append('slices', slice.slices);
      formData.append('text', slice.text);

      if (slice.pizza_image) {
        formData.append('image', slice.pizza_image);
      }

      if (slice.save_image) {
        formData.append('image_save', slice.save_image);
      }

      xhr.send(formData);
    });
    return promise;
  }

  getUsers(): Observable<any> {
    return this.request.get(`${COMMON_URL.admin.all_users}`).pipe(
      tap((data) => {
          console.warn('"About us" data has received.');
          // this.help.setImageUrl(data);
        },
        () => {
          console.error('"About us" error.');
        }));
  }

  deleteUser(id: number): Observable<any> {
    return this.request.destroy(`${COMMON_URL.admin.all_users}/${id}`).pipe(
      tap((data) => {
          console.log('Success');
          // console.warn('"One blog record" data has received.');
          // this.help.setImageUrl(data);
        },
        () => {
          console.error('"One blog record" error.');
        }));
  }

  updateUser(user: any, id: number): Observable<any> {
    return this.request.put(`${COMMON_URL.admin.all_users}/${id}`, user).pipe(
      tap((data) => {
          console.warn('"About us" data has received.');
          // this.help.setImageUrl(data);
        },
        () => {
          console.error('"About us" error.');
        }));
  }

  createUser(user): Observable<any> {
    return this.request.post(`${COMMON_URL.admin.all_users}`, user).pipe(
      tap((data) => {
          console.log('Success');
        },
        () => {
          console.error('"About us" error.');
        }));
  }

  makeAdmin(id, role): Observable<any> {
    return this.request.post(`${COMMON_URL.admin.all_users}/${id}`, role).pipe(
      tap((data) => {
          console.log('Success');
        },
        () => {
          console.error('"About us" error.');
        }));
  }

  sendMail(mailBody): Observable<any> {
    return this.request.post(`${COMMON_URL.subscribers.send_mail}`, mailBody).pipe(
      tap((data) => {
          console.log('Success');
        },
        () => {
          console.error('"About us" error.');
        }));
  }

  getMetaTranslate(id: string, lang: string): Observable<any> {
    return this.request.get(`${COMMON_URL.admin.update}?key=${id}&language=${lang}`).pipe(
      tap(() => {
          // console.log('Get translate is ok.');
        },
        () => {
          console.error('"getMetaTranslate" error.');
        }));
  }

  getAllSubscribers(): Observable<any> {
    return this.request.get(`${COMMON_URL.subscribers.all}`).pipe(
      tap((data) => {
          console.log(data);
        },
        () => {
          console.error('"About us" error.');
        }));
  }

  addSubscriber(subscriber: any): Observable<any> {
    return this.request.post(`${COMMON_URL.subscribers.add}`, subscriber).pipe(
      tap((data) => {
          console.log(data);
        },
        () => {
          console.error('"About us" error.');
        }));
  }

  deleteSubscriber(subscriberId: any): Observable<any> {
    return this.request.destroy(`${COMMON_URL.subscribers.all}/${subscriberId}`).pipe(
      tap((data) => {
          console.log(data);
        },
        () => {
          console.error('"About us" error.');
        }));
  }


}
