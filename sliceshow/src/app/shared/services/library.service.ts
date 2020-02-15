
import {tap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {RequestService} from './request.service';
import {COMMON_URL} from './common.url';
import { Observable } from 'rxjs/Observable';
import {HelperService} from './helper.service';

@Injectable()
export class LibraryService {

  constructor(public request: RequestService, public help: HelperService) {
    }

    // ---------PHOTO----------
    getMyPhotos(): Observable<any> {
        return this.request.get(COMMON_URL.library.photo.all_user)
        .do(() => {
                // this.help.setImageUrl(data);
                },
                () => {
                    console.log('Error');
                });
    }
    showPhoto(id): Observable<any> {
        return this.request.get(COMMON_URL.library.photo.one + id).pipe(
            tap(() => {
                },
                () => {
                    console.log('Error');
                }));
    }
    deletePhoto(id): Observable<any> {
        return this.request.destroy(COMMON_URL.library.photo.one + id).pipe(
            tap(() => {
                },
                () => {
                    console.log('Error');
                }));
    }
    getAllPhoto(): Observable<any> {
        return this.request.get(COMMON_URL.library.photo.all_admin).pipe(
            tap(() => {
                },
                () => {
                    console.log('Error');
                }));
    }
    addPhoto(addingPhotos): Observable<any> {
        return this.request.post(COMMON_URL.library.photo.all_user, addingPhotos).pipe(
            tap(() => {
                },
                () => {
                    console.log('Error');
                }));
    }
    // ---------VIDEO----------
    getMyVideos(): Observable<any> {
        return this.request.get(COMMON_URL.library.video.all_user).pipe(
            tap(() => {
                },
                () => {
                    console.log('Error');
                }));
    }
    showVideo(id): Observable<any> {
        return this.request.get(COMMON_URL.library.video.one + id).pipe(
            tap(() => {
                },
                () => {
                    console.log('Error');
                }));
    }
    deleteVideo(id): Observable<any> {
        return this.request.destroy(COMMON_URL.library.video.one + '/' + id).pipe(
            tap(() => {
                },
                () => {
                    console.log('Error');
                }));
    }
    getAllVideo(): Observable<any> {
        return this.request.get(COMMON_URL.library.video.all_admin).pipe(
            tap(() => {
                },
                () => {
                    console.log('Error');
                }));
    }
    addVideo(addingVideo): Observable<any> {
        return this.request.post(COMMON_URL.library.video.all_user, addingVideo).pipe(
            tap(() => {
                },
                () => {
                    console.log('Error');
                }));
    }
    cropVideo(cropObj): Observable<any> {
        return this.request.put(COMMON_URL.library.video.all_user, cropObj).pipe(
            tap(() => {
                },
                () => {
                    console.log('Error');
                }));
    }
    // ---------MUSIC----------
    getMySongs(): Observable<any> {
        return this.request.get(COMMON_URL.library.music.all_user).pipe(
            tap(() => {
                },
                () => {
                    console.log('Error');
                }));
    }
    getSuggestionSongs(): Observable<any> {
        return this.request.get(COMMON_URL.library.music.all_suggestion).pipe(
            tap(() => {
            },
                () => {
                    console.log('Error');
                }));
    }
    showSong(id): Observable<any> {
        return this.request.get(COMMON_URL.library.music.one + id).pipe(
            tap(() => {
                },
                () => {
                    console.log('Error');
                }));
    }
    deleteSong(id): Observable<any> {
        return this.request.destroy(COMMON_URL.library.music.one + id).pipe(
            tap(() => {
                },
                () => {
                    console.log('Error');
                }));
    }
    getAllSongs(): Observable<any> {
        return this.request.get(COMMON_URL.library.music.all_admin).pipe(
            tap(() => {
                },
                () => {
                    console.log('Error');
                }));
    }
    addSong(addingSong): Observable<any> {
        return this.request.post(COMMON_URL.library.music.all_user, addingSong).pipe(
            tap(() => {
                },
                () => {
                    console.log('Error');
                }));
    }

    getLastUserTrack(): Observable<any> {
        return this.request.get(COMMON_URL.library.music.last_track).pipe(
            tap(() => {
                },
                () => {
                    console.log('Error');
                }));
    }

}
