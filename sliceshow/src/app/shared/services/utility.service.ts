import { Injectable } from '@angular/core';
import { COMMON_URL } from './common.url';
import { Observable, Subscribable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AuthService} from './auth.service';

@Injectable()
export class Utility {

    public progress = new Subject();
    public isLoading = new BehaviorSubject(false);

    constructor(private authService: AuthService) {
    }

    getLoadState() {
        return this.isLoading;
    }

    public getFile(filePath: string): Promise<string> {
        const promise = new Promise<string>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', filePath + '?v=' + Math.random(), true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    resolve(xhr.responseText);
                } else {
                    if (xhr.readyState === 4) {
                        resolve();
                    }
                }
            };
            xhr.send();
        });
        return promise;
    }

    uploadPhoto(file): Promise<any> {
        this.isLoading.next(true);
        const promise = new Promise<any>((resolve, reject) => {
            console.log(file);
            const { token } = JSON.parse(localStorage.getItem('currentUser'));
            const url = COMMON_URL.library.photo.all_user;
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            xhr.addEventListener('readystatechange', (e) => {
                if (xhr.readyState === 4 && xhr.status === 201) {
                    // Done. Inform the user
                    resolve(xhr.responseText);
                    this.isLoading.next(false);
                } else if (xhr.readyState === 4 && xhr.status !== 201) {
                    // Error. Inform the user
                    console.log('Error.');
                    this.isLoading.next(false);
                    reject();
                }
            });

            xhr.upload.onprogress = (event) => {
                // console.log(event);
                const percentDone = Math.round(100 * event.loaded / event.total);
                // console.log(prog);
                this.progress.next(percentDone);
            };

            formData.append('file', file);
            formData.append('name', 'file');
            xhr.send(formData);
        });
        return promise;
    }
    uploadVideo(file): Promise<any> {
        this.isLoading.next(true);
        const promise = new Promise<any>((resolve, reject) => {
            console.log(file);
            const { token } = JSON.parse(localStorage.getItem('currentUser'));
            const url = COMMON_URL.library.video.all_user;
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            xhr.addEventListener('readystatechange', (e) => {
                if (xhr.readyState === 4 && xhr.status === 201) {
                    // Done. Inform the user
                    resolve(xhr.responseText);
                    this.isLoading.next(false);
                } else if (xhr.readyState === 4 && xhr.status !== 201) {
                    // Error. Inform the user
                    console.log('Error.');
                    this.isLoading.next(false);
                    reject();
                }
            });

            formData.append('file', file);
            formData.append('name', 'file');

            xhr.upload.onprogress = (event) => {
                console.log(event);
                const percentDone = Math.round(100 * event.loaded / event.total);
                // console.log(prog);
                this.progress.next(percentDone);
            };

            xhr.send(formData);
        });
        return promise;
    }
    uploadMusic(file): Promise<any> {
        this.isLoading.next(true);
        const promise = new Promise<any>((resolve, reject) => {
            console.log(file);
            const { token } = JSON.parse(localStorage.getItem('currentUser'));
            const url = COMMON_URL.library.music.all_user;
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            xhr.addEventListener('readystatechange', (e) => {
                if (xhr.readyState === 4 && xhr.status === 201) {
                  console.log('UTILITY SERVICE');
                    // Done. Inform the user
                    resolve(xhr.responseText);
                    this.isLoading.next(false);
                } else if (xhr.readyState === 4 && xhr.status !== 201) {
                    // Error. Inform the user
                    console.log('Error.');
                    this.isLoading.next(false);
                    reject();
                }
            });

            xhr.upload.onprogress = (event) => {
                console.log(event);
                const percentDone = Math.round(100 * event.loaded / event.total);
                // console.log(prog);
                this.progress.next(percentDone);
            };

            formData.append('file', file);
            // formData.append('name', 'file');
            xhr.send(formData);
        });
        return promise;
    }

}
