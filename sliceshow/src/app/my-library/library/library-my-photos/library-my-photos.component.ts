import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig} from '@angular/material';
import {DragYourFilesComponent} from '../drag-your-files/drag-your-files.component';
import {LibraryService} from '../../../shared/services/library.service';
import {LibraryStore} from '../../store/library.store';
import {NotifierService} from 'angular-notifier';
import {LibraryPreviewFilesComponent} from '../library-preview-files/library-preview-files.component';
import {AuthService} from '../../../shared/services/auth.service';


@Component({
  selector: 'app-library-my-photos',
  templateUrl: './library-my-photos.component.html',
  styleUrls: ['./library-my-photos.component.scss']
})
export class LibraryMyPhotosComponent implements OnInit {

  // images: Array<any> = [];


  constructor(public dialog: MatDialog,
              public library: LibraryService,
              public store: LibraryStore,
              private readonly notifier: NotifierService,
              private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.subscribeStateUpdates();
    this.store.state.currentPage = 'myPhoto';
    this.store.state.acceptFile = 'image/*';
    this.getPhotos();
  }

  openDialogUploadFiles() {
    console.log(123);
    this.dialog.open(DragYourFilesComponent);
  }

  removeImg(id) {
    this.store.removePhoto(id);
    this.library.deletePhoto(id)
      .subscribe(data => {
        console.log(data);
        this.authService.getLimit();
      }, error => {
        this.notifier.notify('error', 'Photo not deleted, please refresh the page and try again');
        console.log(error);
      });
  }

  subscribeStateUpdates = (): void => {
    this.store.state$.subscribe(state => {
      // console.log(state);
    });
  }
  getPhotos = (): void => {
    this.library.getMyPhotos()
      .subscribe(data => {
        this.store.saveMyPhoto(data);
      }, error => {
      });
  }
  openImage(image) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      'type': 'image',
      ...image
    };
    dialogConfig.panelClass = ['modal-padding'];


    this.dialog.open(LibraryPreviewFilesComponent, dialogConfig);
    // window.open(image.file, '_blank');
  }

}
