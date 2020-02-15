import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import {MatDialog} from '@angular/material';
import { DragYourFilesComponent } from '../drag-your-files/drag-your-files.component';
import { LibraryService } from '../../../shared/services/library.service';
import { LibraryStore } from '../../store/library.store';
import { NotifierService } from 'angular-notifier';
import { AuthService } from '../../../shared/services/auth.service';
import { AudioService } from '../../../shared/templates/audio.service';

@Component({
  selector: 'app-library-my-music',
  templateUrl: './library-my-music.component.html',
  styleUrls: ['./library-my-music.component.scss']
})
export class LibraryMyMusicComponent extends AudioService implements OnInit, OnDestroy {

  constructor(public dialog: MatDialog,
    public library: LibraryService,
    public store: LibraryStore,
    private readonly notifier: NotifierService,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit() {
    this.store.setCurrentPage('myMusic');
    this.store.setAcceptedFiles('.mp3,audio/*');
    this.fetchSongs();
    // this.subscribeStateUpdates();
  }

  openDialogUploadFiles() {
    this.dialog.open(DragYourFilesComponent);
  }
  removeSong(id) {
    this.store.removeSong(id);
    this.library.deleteSong(id)
    .subscribe(data => {
      this.authService.getLimit();
    }, error => {
      this.notifier.notify('error', 'Song not deleted, please refresh the page and try again');
      console.log(error);
    });
  }

  fetchSongs = () => {
    this.library.getMySongs()
      .subscribe(data => {
        console.log(data);
        this.store.saveMyMusic(data);
      }, error => {
        console.log(error);
      });
  }

  subscribeStateUpdates = (): void => {
    this.store.state$.subscribe(state => {
      console.log(state);
    });
  }

  ngOnDestroy() {
    // this.pause();
  }


}
