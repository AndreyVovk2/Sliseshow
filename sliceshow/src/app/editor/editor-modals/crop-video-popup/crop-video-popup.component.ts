import {Component, OnInit, Inject, ElementRef} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {AppStore} from '../../../shared/store/app.store';
import {LibraryService} from '../../../shared/services/library.service';
import {EditingStore} from '../../store/editing.store';
// import { RangeSliderComponent} from '../../editor-components/range-slider/range-slider.component';
// import { AppStore } from '../../shared/store/app.store';
// import { EditingStore } from '../../modules/editing-system/editing.store';
// import { LibraryService } from '../../shared/services/library.service';

@Component({
  selector: 'app-crop-video-popup',
  templateUrl: './crop-video-popup.component.html',
  styleUrls: ['./crop-video-popup.component.scss']
})
export class CropVideoPopupComponent implements OnInit {

  // @ViewChild(RangeSliderComponent)
  // private rangeSliderComponent: RangeSliderComponent;


  duration = 0;
  rangeDuration = 0;
  startTime = 0;

  playerOnLoad = false;

  videoWidth: string;
  videoHeight: string;


  prop = {
    muteVideo: true,
    muteMusic: false,
    lowerMusic: false,
    sameMusic: false
  };

  constructor(public dialogRef: MatDialogRef<CropVideoPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public store: AppStore,
              public library: LibraryService,
              public editingStore: EditingStore,
              private dialog: MatDialog,
              public el: ElementRef) {
  }


  ngOnInit() {
    console.log(this.data);

    // this.setVideoStart ();
    // this.rangeDuration = +this.data.duration / 30;
    this.rangeDuration = +this.data.duration;
    // console.log(this.rangeDuration, +this.data.duration);
    this.duration = 500;
    // this.duration = 200;

  }

  setVideoStart() {
    if (this.data.crop != null) {
      const videoElem = <HTMLVideoElement>document.getElementById('myVideo');
      const startPoint = Math.abs(this.data.crop.inPoint);
      videoElem.addEventListener('loadedmetadata', function () {
        console.log(startPoint);
        videoElem.currentTime = startPoint;
      }, false);
    }
  }


  listener(e) {
    const player = this.el.nativeElement.querySelector('video');
    this.duration = player.duration;
    // console.log(this.duration);
    if (player.currentTime >= (this.rangeDuration + this.startTime)) {
      // if (player.currentTime >= this.endTime && this.endTime !== 0) {
      //   player.pause();
    }
  }

  saveAndUpload() {
     this.editingStore.state.activeMediaParam.crop = {
      startTime: 0,
      inPoint: 0 - this.startTime,
      outPoint: 0 + this.rangeDuration,
      audioLevel: 80
    };
    this.pruningVideo();

    // this.editingStore.state.activeMediaParam.crop.startTime = 0;
    // this.editingStore.state.activeMediaParam.crop.inPoint = 0 - this.startTime;
    // this.editingStore.state.activeMediaParam.crop.outPoint = 0 - this.startTime + this.rangeDuration;
    // this.editingStore.state.activeMediaParam.crop.audioLevel = 80;
    // this.editingStore.state.activeMediaParam.crop.position = [30, 40];
    // this.editingStore.state.activeMediaParam.crop.scale = [0, 60];

    // uploading.start = Math.round(this.startTime);
    // uploading.duration = Math.round(this.rangeDuration);
    // console.log(this.editingStore.state.activeMediaParam);
    this.editingStore._addCropMedia();
    // this.editingStore.storeMedia(this.editingStore.state.activeMediaParam.link);
    this.closeModal();

  }

  pruningVideo() {
    const video = {
      link: 'https://slice-show.grassbusinesslabs.tk/storage/library/videos/video_28361537219048.mp4',
      start: 9 ,
      duration: 18
    };
    this.library.cropVideo(video).subscribe(res => {
      console.log(res);
    });
  }

  getCutTrack(e) {
    console.log(e);
    this.startTime = e.startTime;
    this.updatePlayer();
  }


  changeGender(event, num) {
    event.stopPropagation();
    event.preventDefault();
    const player = this.el.nativeElement.querySelector('video');
    switch (num) {
      case 1:
        this.prop.muteVideo = true;
        this.prop.muteMusic = false;
        this.prop.lowerMusic = false;
        this.prop.sameMusic = false;
        player.muted = true;
        break;

      case 2:
        this.prop.muteVideo = false;
        this.prop.muteMusic = true;
        this.prop.lowerMusic = false;
        this.prop.sameMusic = false;
        player.muted = false;
        break;

      case 3:
        this.prop.muteVideo = false;
        this.prop.muteMusic = false;
        this.prop.lowerMusic = true;
        this.prop.sameMusic = false;
        player.muted = false;
        break;

      case 4:
        this.prop.muteVideo = false;
        this.prop.muteMusic = false;
        this.prop.lowerMusic = false;
        this.prop.sameMusic = true;
        player.muted = false;
        break;
    }
    console.log(this.prop);
  }

  onMetadata(e) {
    event.stopPropagation();
    event.preventDefault();
    // console.log('metadata: ', e);
    // console.log(e.srcElement.duration);
    this.duration = e.srcElement.duration;
    // console.log(this.rangeDuration, this.duration);
    this.updatePlayer();
  }

  updatePlayer() {
    const player = this.el.nativeElement.querySelector('video');
    player.muted = true;
    player.currentTime = this.startTime;
    this.videoHeight = player.videoHeight;
    this.videoWidth = player.videoWidth;
    player.play();
    this.playerOnLoad = true;
    // console.log(this.startTime, this.rangeDuration, this.duration);
  }

  closeModal() {
    this.dialogRef.close();
  }

}
