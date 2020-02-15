import { Injectable } from '@angular/core';
import { Store } from 'rxjs-observable-store';
import { LibraryState } from './library-state';
import { LibraryService } from '../../shared/services/library.service';

@Injectable()
export class LibraryStore extends Store<LibraryState> {

    constructor(private libService: LibraryService) {
        super(new LibraryState());
        // this.updatePhoto();
    }
    saveOnePhoto(photo: LibraryState['photo']): void {
        this.setState({
        ...this.state,
        myPhoto: [
            ...this.state.myPhoto,
            photo,
        ]
        });
    }

    saveMyPhoto(myPhoto: LibraryState['myPhoto']): void {
        this.setState({
        ...this.state,
            myPhoto,
        photoLoaded: true,
        });
    }



    saveMyVideo(video: LibraryState['video']): void {
        this.setState({
        ...this.state,
        videoLoaded: true,
        myVideo: [
            ...this.state.myVideo,
            video,
        ]
        });
    }
    saveMyVideos(myVideo: LibraryState['myVideo']): void {
        this.setState({
            ...this.state,
            videoLoaded: true,
            myVideo,
        });
    }
    saveMyMusic(myMusic: LibraryState['myMusic']): void {
        this.setState({
            ...this.state,
            myMusic,
            musicLoaded: true,
        });
    }
    updateMyMusic(song: LibraryState['song']): void {
      console.log(song);
        this.setState({
            ...this.state,
            myMusic: [
                ...this.state.myMusic,
                song
            ],
        });
        console.log(this.state.myMusic);
    }
    addPendingSong(pendingSong: LibraryState['pendingSong']): void {
        this.setState({
            ...this.state,
            pendingSongs: [
                ...this.state.pendingSongs,
                pendingSong
            ],
        });
    }
    addPendingPhoto(pendingPhoto: LibraryState['pendingPhoto']): void {
        console.log(pendingPhoto);
        this.state.pendingPhotos.push(pendingPhoto);
        // this.setState({
        //     ...this.state,
        //     pendingPhotos: [
        //         ...this.state.pendingPhotos,
        //         pendingPhoto
        //     ],
        // });
        console.log(this.state.pendingPhotos);
        console.log(this.state.myPhoto);
    }
    removePendingPhoto(pendingPhotoId: LibraryState['pendingPhoto']['id']): void {
        this.setState({
            ...this.state,
            pendingPhotos: this.state.pendingPhotos.filter(v => v.id !== pendingPhotoId)
        });
    }
    removePendingSong(pendingSongId: LibraryState['pendingSong']['id']): void {
        this.setState({
            ...this.state,
            pendingSongs: this.state.pendingSongs.filter(v => v.id !== pendingSongId)
        });
    }
    removePhoto(imageId: LibraryState['photo']['id']): void {
        this.setState({
            ...this.state,
            myPhoto: this.state.myPhoto.filter(v => v.id !== imageId)
        });
    }
    removeVideo(videoId: LibraryState['video']['id']): void {
        this.setState({
            ...this.state,
            myVideo: this.state.myVideo.filter(v => v.id !== videoId)
        });
    }
    removeSong(songId: LibraryState['song']['id']): void {
        this.setState({
            ...this.state,
            myMusic: this.state.myMusic.filter(v => v.id !== songId)
        });
    }

    setCurrentPage(currentPage: LibraryState['currentPage']): void {
        this.setState({
            ...this.state,
            currentPage
        });
    }

    setAcceptedFiles(acceptFile: LibraryState['acceptFile']): void {
        this.setState({
            ...this.state,
            acceptFile
        });
    }

    clearStore(): void {
        this.setState({
            ...this.state,
            myVideo: [],
            myPhoto: [],
            myMusic: []
        });
    }



}
