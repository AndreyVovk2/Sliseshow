import {COMMON_URL} from './common.url';
import {Observable} from 'rxjs/Observable';
import {RequestService} from './request.service';
import {text} from '@angular/core/src/render3/instructions';
import {NotifierService} from 'angular-notifier';
import {AdminStore} from '../../admin/adminChange/admin.store';

import {tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';

@Injectable()
export class AudioService {

  public requestStatus = 0;
  public uploadStart = false;
  private addSongs: any;

  constructor(
    public request: RequestService,
    private readonly notifier: NotifierService,
    private adminStore: AdminStore) {
  }

  getAllRecAudio(): Observable<any> {
    return this.request.get(`${COMMON_URL.library.music.all_suggestion}`).pipe(
      tap((result) => {
        console.log(result);
      }, (error) => {
        console.log(error);
      })
    );
  }

  getAllRecCategory(params: any = {}): Observable<any> {
    return this.request.get(`${COMMON_URL.library.music.all_suggestion}` + `?style=${params}`).pipe(
      tap((result) => {
        console.log(result);
      }, (error) => {
        console.log(error);
      })
    );
  }

  addRecSong(files): Promise<any> {
    console.log(files);
    this.uploadStart = true;
    const promise = new Promise<any>((resolve, reject) => {
      const {token} = JSON.parse(localStorage.getItem('currentUser'));
      const url = `${COMMON_URL.library.music.all_suggestion}`;
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      xhr.responseType = 'json';
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.addEventListener('readystatechange', (e) => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          resolve(xhr.response);
          this.uploadStart = false;
          this.addSongs = xhr.response;
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
          console.log(xhr.response);
          reject();
          this.uploadStart = false;
        }
      });
      // @ts-ignore
      files.forEach((file, i) => {
        formData.append(`tracks[${i}][name]`, file.name);

        if (file.style === 'Pop') {
          formData.append(`tracks[${i}][music_style_rid]`, '1' );
        } else if (file.style === 'Jazz') {
          formData.append(`tracks[${i}][music_style_id]`, '2' );
        } else if (file.style === 'HardRock') {
          formData.append(`tracks[${i}][music_style_id]`, '3' );
        } else if (file.style  === 'Classic') {
          formData.append(`tracks[${i}][music_style_id]`, '4');
        }
        formData.append(`tracks[${i}][file]`, file.file);
      });

      // formData.append('file', file);
      // formData.append('name', data.name);
      // formData.append('style', data.style);

      xhr.upload.onprogress = (event) => {
        this.requestStatus = Math.round(100 * event.loaded / event.total);
        console.log(this.requestStatus);
      };

      xhr.send(formData);

    });
    return promise;
  }

  deleteRecSong(songId): Observable<any> {
    return this.request.destroy(`${COMMON_URL.library.music.all_suggestion}/${songId}`).pipe(
      tap((result) => {
        console.log(result);
      }, (error) => {
        console.log(error);
      })
    );
  }


}

