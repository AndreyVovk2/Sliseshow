import { Directive, HostListener, HostBinding } from '@angular/core';
import { Utility } from '../../../shared/services/utility.service';
import { LibraryStore } from '../../store/library.store';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DragYourFilesComponent } from './drag-your-files.component';
import { COMMON_URL } from '../../../shared/services/common.url';
import { NotifierService } from 'angular-notifier';

@Directive({
  selector: '[appDnd]',

})
export class DndDirective {

  @HostBinding('style.border') private border = '2px dashed #edf2fa';

  constructor(private utility: Utility, private store: LibraryStore, private dialog: MatDialog,
    public dialogRef: MatDialogRef<DragYourFilesComponent>,
    private readonly notifier: NotifierService,
    public component: DragYourFilesComponent
  ) {}

  // @HostListener('change', ['$event']) public onChangeOver(evt) {
  //   console.log(evt);
  //   evt.preventDefault();
  //   evt.stopPropagation();
  //   const files = evt.target.files;
  //   console.log(files);
  //   if (files.length > 0) {
  //     this.uploadingBranch(files);
  //   }
  //
  // }

  @HostListener('dragover', ['$event']) public onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.border = '2px dashed #ccc';
  }
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.border = '2px dashed #edf2fa';

  }
  @HostListener('drop', ['$event']) public onDrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    const files = evt.dataTransfer.files;
    this.border = '2px dashed #edf2fa';
    if (files.length > 0) {
      this.uploadingBranch(files);
      // if (this.store.state.currentPage === 'myPhoto') {
      //   console.log('myPhoto');
      //   Array.prototype.forEach.call(files, this._handlePhotoUpload);
      // } else if (this.store.state.currentPage === 'myVideo') {
      //   console.log('myVideo');
      //   this.utility.uploadVideo(files[0])
      //     .then(data => {
      //       console.log(JSON.parse(data));
      //       this.store.saveMyVideo(JSON.parse(data));
      //       this.dialogRef.close();
      //     }, error => {
      //       console.log(error);
      //     });
      // } else if (this.store.state.currentPage === 'myMusic') {
      //   console.log('myMusic');
      //   Array.prototype.forEach.call(files, this._handleMusicUpload);
      // }
    }
  }

  checkFilesType(files, type) {
    let filesArr = [];
    Array.prototype.push.apply(filesArr, files);
    for (let i = 0; i < filesArr.length; i++) {
      if (!filesArr[i].type.includes(type)) {
        filesArr.splice(i, 1);
        i--;
      }
    }
    if (filesArr.length === 0) {
      this.notifier.notify('error', 'Something wrong. Try again');
    }
    return filesArr;
  }


  uploadingBranch(files) {
    if (this.store.state.currentPage === 'myPhoto') {
      const filesArr = this.checkFilesType(files, 'image');
      console.log('myPhoto');
      if (files.length > 0) {
        Array.prototype.forEach.call(filesArr, this._handlePhotoUpload);
      }

    } else if (this.store.state.currentPage === 'myVideo') {
      const filesArr = this.checkFilesType(files, 'video');
      console.log('myVideo');
      this.utility.uploadVideo(filesArr[0])
        .then(data => {
          console.log(JSON.parse(data));
          this.store.saveMyVideo(JSON.parse(data));
          this.dialogRef.close();
        }, error => {
          console.log(error);
        });
    } else if (this.store.state.currentPage === 'myMusic') {
      const filesArr = this.checkFilesType(files, 'audio');
      console.log(filesArr);
      if (files.length > 0) {
        Array.prototype.forEach.call(filesArr, this._handleMusicUpload);
      }

    }
  }

  _handlePhotoUpload = (file): void => {
    console.log(file);
    const currentTimestamp = + new Date();

    this.store.addPendingPhoto({
      id: currentTimestamp,
      name: file.name
    });

    this.dialogRef.close();

    this.utility.uploadPhoto(file)
      .then(data => {
        // this.store.saveMyPhoto(JSON.parse(data));
        this.store.saveOnePhoto(JSON.parse(data));
        this.store.removePendingPhoto(currentTimestamp);
      }, error => {
        this.store.removePendingPhoto(currentTimestamp);
        this.notifier.notify('info', 'Some error occured, please try again!');
        console.log(error);
      });
  }

  _handleMusicUpload = (file): void => {
    console.log('_handleMusicUpload');
    const currentTimestamp = + new Date();
    const { token } = JSON.parse(localStorage.getItem('currentUser'));
    const url = COMMON_URL.library.music.all_user;
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    this.store.addPendingSong({
      id: currentTimestamp,
      name: file.name
    });
    this.dialogRef.close();

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.addEventListener('readystatechange', (event: FileReaderEvent) => {
      if (xhr.readyState === 4 && xhr.status === 201) {
        console.log('DND SERVICE');
        this.store.updateMyMusic(JSON.parse(xhr.responseText));
        this.store.removePendingSong(currentTimestamp);
      } else if (xhr.readyState === 4 && xhr.status !== 201) {
        this.store.removePendingSong(currentTimestamp);
        const response = JSON.parse(xhr.responseText);
        if (response.error) {
          this.notifier.notify('error', response.error);
        } else {
          this.notifier.notify('info', 'Some error occured, please try again!');
        }
      }
    });

    formData.append('file', file);
    // formData.append('name', 'file');

    xhr.upload.onprogress = (event) => {
      const percentDone = Math.round(100 * event.loaded / event.total);
      console.log(percentDone);
    };

    xhr.send(formData);
  }
}
