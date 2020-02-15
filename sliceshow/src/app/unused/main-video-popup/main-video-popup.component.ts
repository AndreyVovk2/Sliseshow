import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LibraryService } from '../../shared/services/library.service';
import { Utility } from '../../shared/services/utility.service';

@Component({
  selector: 'app-main-video-popup',
  templateUrl: './main-video-popup.component.html',
  styleUrls: ['./main-video-popup.component.scss']
})
export class MainVideoPopupComponent implements OnInit {

  selectVideo = {id: 0, file: ''};
  allVideos = [];
  videoLoaded = false;

  constructor(
    public dialogRef: MatDialogRef<MainVideoPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public libService: LibraryService,
    public utility: Utility
  ) { }

  ngOnInit() {
    this.getVideo();
    console.log(this.data);
  }

  show(event) {
    this.uploadVideo(event.target.files[0]);
  }

  selectVid(video) {
    this.selectVideo = video;
    console.log(this.selectVideo);
  }

  getVideo = (): void => {
    this.libService.getMyVideos()
      .subscribe(data => {
        this.allVideos = data;
        console.log(this.allVideos);
        this.videoLoaded = true;
      }, error => {
        this.allVideos = [];
        this.videoLoaded = true;
        console.log(error);
      });
  }

  uploadVideo(file) {
    this.utility.uploadVideo(file)
    .then(data => {
      const newVideo = JSON.parse(data);
      console.log(newVideo);
      this.allVideos.push(newVideo);
      this.dialogRef.close(newVideo.file);
    }, error => {
      console.log(error);
    });
  }

  chooseVideo() {
    if (this.selectVideo.file) {
      this.dialogRef.close(this.selectVideo.file);
    }
    // console.log(this.data);
    // this.dialogRef.close(this.selectVideo);
  }

  // saveAndClose() {
  //   this.data.link = this.selectVideo.file;
  //   this.dialogRef.close(this.selectVideo);
  // }

}
