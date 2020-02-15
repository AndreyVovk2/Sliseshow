import {Component, OnInit, Input } from '@angular/core';
import { COMMON_URL } from '../../../shared/services/common.url';
import { TimelineStore } from '../../timeline/timeline-store/timeline.store';
import { TimelineState } from '../../timeline/timeline-store/timeline-state';
import { NotifierService } from 'angular-notifier';
import { AuthService } from '../../../shared/services/auth.service';


@Component({
  selector: 'app-library-section',
  templateUrl: './library-section.component.html',
  styleUrls: ['./library-section.component.scss'],
  providers: [TimelineStore]
})
export class LibrarySectionComponent implements OnInit {
  @Input() store: TimelineStore;
  public borderOnDrag = false;
  private limitSize;
  public totalPause: '';
  private generalLimit = 2147483648;
  

  constructor( private notifier: NotifierService,
               private authService: AuthService) {}

  ngOnInit() {
    this.getUserLimit();
  }


  handleDropMusic = (event): void => {
    event.preventDefault();
    this.handleFiles(event.dataTransfer.files);
    this.handleDragLeave();
  }

  preventDrag(event): void {
    event.preventDefault();
    this.handleDragOver();
  }

  handleDragOver = () => {
    this.borderOnDrag = true;
  }

  handleDragLeave = () => {
    this.borderOnDrag = false;
  }

  handleFiles = (files): void => {
    console.log('upload music HERE!');
    Array.prototype.forEach.call(files, this.uploadFile);
  }

  handleStyleFilter = (params): void => {
    this.store.updateLibraryFilters({
      style: params.toLowerCase()
    });
  }

  handleDurationFilter = (params): void => {
    this.store.updateLibraryFilters({
      duration: params.toLowerCase()
    });
  }

  handleUse = (song: TimelineState['musicItem']): void => {
    if (this.store.state.musicLibraryFilters.libraryType === 1) {
      this.store.addTrack(song, 'user');
    } else if (this.store.state.musicLibraryFilters.libraryType === 2) {
      this.store.addTrack(song, 'suggestion');
    }

  }


  getUserLimit() {
    this.authService.getLimit();
    this.limitSize = JSON.parse(localStorage.getItem('currentUser')).used;
    // console.log('getUserLimit');
    //  this.authService.getLimit().subscribe(data => {
    //   this.limitSize = data;
    //    // console.log(this.limitSize);
    // }, (error) => {
    //   // this.notifier.notify('error', '');
    //   console.log(error);
    // });
  }

  checkAudioSize (fileSize) {
  this.getUserLimit();
    if (fileSize <= this.generalLimit - this.limitSize) {
      return true;
    } else {
      this.notifier.notify('error', 'Too large File');
      return false;
    }
  }

  checkAudioType(file) {
    if (file.type.includes('audio')) {
      return true;
    } else {
      this.notifier.notify('error', 'Wrong file type');
      return false;
    }
  }

  uploadFile = (file): void => {
    console.log(file);
    const currentTimestamp = + new Date();
    const { token } = JSON.parse(localStorage.getItem('currentUser'));
    const url = COMMON_URL.library.music.all_user;
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    if (this.checkAudioSize(file.size) && this.checkAudioType(file)) {
      console.log('IT*S OK');
      this.store.addPendingSong({
        id: currentTimestamp,
        name: file.name
      });

      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.addEventListener('readystatechange', (event: FileReaderEvent) => {
        if (xhr.readyState === 4 && xhr.status === 201) {
          this.store.updateSongs(JSON.parse(xhr.responseText));
          this.store.removePendingSong(currentTimestamp);
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
          this.store.removePendingSong(currentTimestamp);
          // TODO: handle error
          this.notifier.notify('error', 'Music upload error');
        }
      });

      formData.append('file', file);
      formData.append('name', 'file');

      xhr.onprogress = (event) => {
        console.log(event);
        const percentDone = Math.round(100 * event.loaded / event.total);
        console.log(percentDone);
      };
      xhr.send(formData);
    }
  }




  // renderTracks() {
    
  //   this.store.checkTrackInRange(0, 465);
  //   console.log(this.store.state);
  // }
  

}
