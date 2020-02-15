import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig} from '@angular/material';
import { DragYourFilesComponent } from '../drag-your-files/drag-your-files.component';
import { LibraryService } from '../../../shared/services/library.service';
import { LibraryStore } from '../../store/library.store';
import {LibraryPreviewFilesComponent} from '../library-preview-files/library-preview-files.component';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-library-my-videos',
  templateUrl: './library-my-videos.component.html',
  styleUrls: ['./library-my-videos.component.scss']
})
export class LibraryMyVideosComponent implements OnInit {
  // images: Array<any> = [];

  constructor(public dialog: MatDialog,
              public library: LibraryService,
              public store: LibraryStore,
              private authService: AuthService) { }

    ngOnInit() {
      this.store.state.currentPage = 'myVideo';
      this.store.state.acceptFile = 'video/mp4,video/x-m4v,video/*';
      if (this.store.state.myVideo.length === 0) {
        this.library.getMyVideos()
      .subscribe(data => {
        data.forEach((video) => {
          this.store.saveMyVideo(video);
        });
        console.log(this.store.state);
      }, error => {
        console.log(error);
      });
      }
    }

    playVideo(video) {
      console.log(video);
      console.log('Play Video Please');
      window.open(video.file, '_blank');
    }

    openDialogUploadFiles() {
      console.log(123);
      this.dialog.open(DragYourFilesComponent);
    }
    removeVideo(id) {
      this.library.deleteVideo(id)
      .subscribe(data => {
        this.store.removeVideo(id);
        this.authService.getLimit();
        console.log(data);
      }, error => {
        console.log(error);
      });
    }
    // this.images = [
    //   {
    //     fileName: 'Photo 1',
    //     url: '../../../assets/images/favorites/Favorites1.png',
    //     liked: true,
    //     includingVideo: true,
    //     styleNumber: 1,
    //     duration: 50,
    //     id: '0'
    //   },
    //   {
    //     fileName: 'Photo 2',
    //     url: '../../../assets/images/favorites/Favorites2.png',
    //     liked: true,
    //     includingVideo: true,
    //     styleNumber: 1,
    //     duration: 50,
    //     id: '1'
    //   },
    //   {
    //     fileName: 'Photo 3',
    //     url: '../../../assets/images/favorites/Favorites3.png',
    //     liked: true,
    //     includingVideo: true,
    //     styleNumber: 1,
    //     duration: 50,
    //     id: '2'
    //   },
    //   {
    //     fileName: 'Photo 4',
    //     url: '../../../assets/images/favorites/Favorites4.png',
    //     liked: true,
    //     includingVideo: true,
    //     styleNumber: 1,
    //     duration: 50,
    //     id: '3'
    //   },
    //   {
    //     fileName: 'Photo 5',
    //     url: '../../../assets/images/favorites/Favorites5.png',
    //     liked: true,
    //     includingVideo: true,
    //     styleNumber: 1,
    //     duration: 50,
    //     id: '4'
    //   },
    //   {
    //     fileName: 'Photo 6',
    //     url: '../../../assets/images/favorites/Favorites6.png',
    //     liked: true,
    //     includingVideo: true,
    //     styleNumber: 1,
    //     duration: 50,
    //     id: '5'
    //   },
    //   {
    //     fileName: 'Photo 7',
    //     url: '../../../assets/images/favorites/Favorites1.png',
    //     liked: true,
    //     includingVideo: true,
    //     styleNumber: 1,
    //     duration: 50,
    //     id: '6'
    //   },
    //   {
    //     fileName: 'Photo 8',
    //     url: '../../../assets/images/favorites/Favorites2.png',
    //     liked: false,
    //     includingVideo: false,
    //     styleNumber: 1,
    //     duration: 50,
    //     id: '7'
    //   },
    //   {
    //     fileName: 'Photo 9',
    //     url: '../../../assets/images/favorites/Favorites3.png',
    //     liked: true,
    //     includingVideo: true,
    //     styleNumber: 1,
    //     duration: 50,
    //     id: '8'
    //   },
    //   {
    //     fileName: 'Photo 10',
    //     url: '../../../assets/images/favorites/Favorites4.png',
    //     liked: true,
    //     includingVideo: true,
    //     styleNumber: 1,
    //     duration: 50,
    //     id: '9'
    //   },
    //   {
    //     fileName: 'Photo 11',
    //     url: '../../../assets/images/favorites/Favorites5.png',
    //     liked: true,
    //     includingVideo: true,
    //     styleNumber: 1,
    //     duration: 50,
    //     id: '10'
    //   },
    //   {
    //     fileName: 'Photo 12',
    //     url: '../../../assets/images/favorites/Favorites6.png',
    //     liked: true,
    //     includingVideo: true,
    //     styleNumber: 1,
    //     duration: 50,
    //     id: '11'
    //   }
    // ];
  // }

  subscribeStateUpdates = (): void => {
    this.store.state$.subscribe(state => {
      console.log(state);
    });
  }

  openVideo(video) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      'type': 'video',
      ...video
    };
    dialogConfig.panelClass = ['modal-padding'];


    this.dialog.open(LibraryPreviewFilesComponent, dialogConfig);
    // window.open(image.file, '_blank');
  }

}
