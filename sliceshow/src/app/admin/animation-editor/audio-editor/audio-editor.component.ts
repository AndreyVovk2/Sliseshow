import {Component, OnInit, Input, EventEmitter, Output, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {LibraryStore} from '../../../my-library/store/library.store';
import {ActivatedRoute, Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {AudioPopupComponent} from '../audio-popup/audio-popup.component';
import {MatDialog} from '@angular/material';

import {AudioService} from '../../../shared/services/audio.service';

@Component({
  selector: 'audio-editor',
  templateUrl: './audio-editor.component.html',
  styleUrls: ['./audio-editor.component.scss']
})

export class AudioEditorComponent implements OnInit, OnDestroy {

  public recommendingSongs = [];
  public spinnerStatus = true;
  audioStyles = [
    'Pop',
    'Jazz',
    'HardRock',
    'Classic'
  ];

  constructor(
    private libraryStore: LibraryStore,
    private matDialog: MatDialog,
    private notifierService: NotifierService,
    private audioService: AudioService,
    private router: Router) {

  }

  addSing: number;

  ngOnInit() {
    this.getRecSongs();
    this.setCurrentPage();
    this.text();
  }

  setCurrentPage() {
    this.libraryStore.setCurrentPage('recSongs');
    this.libraryStore.setAcceptedFiles('.mp3,audio/*');
  }

  getRecSongs() {
    this.audioService.getAllRecAudio().subscribe((result) => {
      this.recommendingSongs = result;
      this.spinnerStatus = false;

      console.log(result);
    }, (error) => {
      console.log(error);
      this.recommendingSongs = [];
      this.notifierService.notify('error', 'Get recommended songs error');
    });
  }

  text() {
    window.onbeforeunload = function(e) {
      return 'Dialog text here. Iffy functionality.';
    };
  }

  deleteRecSong(songId, arrayPosition) {
    console.log(songId);
    this.audioService.deleteRecSong(songId).subscribe((result) => {
      console.log(result);
      this.recommendingSongs.splice(arrayPosition, 1);
      // this.getRecSongs();
    }, (error) => {
      console.log(error);
    });
  }

  openDialogUploadFiles() {
    const dialogRef = this.matDialog.open(AudioPopupComponent, {panelClass: 'modal-padding'});
    dialogRef.afterClosed().subscribe((result) => {
      console.log('MODAL CLOSED');
      console.log(result);
      if (result) {
        this.addNewSongsToDisplay(result);
      }
    });
  }

  addNewSongsToDisplay(newSongs) {
    const concatAudio = [...this.recommendingSongs, ...newSongs];
    this.recommendingSongs = concatAudio;
  }


  ngOnDestroy() {

  }


  addAudio(event) {

    if (event === 'Pop') {
      this.addSing = 1;

    } else if (event === 'Jazz') {
      this.addSing = 2;
    } else if (event === 'HardRock') {
      this.addSing = 3;
    } else if (event === 'Classic') {
      this.addSing = 4;
    }
    this.getRecSongs();
    console.log(this.addSing);
    this.createSing();

  }

  createSing() {
    this.audioService.getAllRecCategory(this.addSing).subscribe(res => {
      console.log(res);
      this.recommendingSongs = res;
    });
  }
}
