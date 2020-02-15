import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {EditingStore} from '../../store/editing.store';
import {LibraryStore} from '../../../my-library/store/library.store';
import {LibraryService} from '../../../shared/services/library.service';
import {ProjectService} from '../../../shared/services/project.service';
import {AppStore} from '../../../shared/store/app.store';
// import { EditingStore } from '../../modules/editing-system/editing.store';
// import { LibraryStore } from '../../my-library/store/library.store';
// import { LibraryService } from '../../shared/services/library.service';
// import { ProjectService } from '../../shared/services/project.service';
// import { AppStore } from '../../shared/store/app.store';


@Component({
  selector: 'app-editing-popup',
  templateUrl: './editing-popup.component.html',
  styleUrls: ['./editing-popup.component.scss']
})
export class EditingPopupComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EditingPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public editingStore: EditingStore,
    public libStore: LibraryStore,
    public libService: LibraryService,
    public projectService: ProjectService,
    public store: AppStore
  ) {
  }

  @ViewChild('color') color: any;
  @ViewChild('value') value: number;
  selectImg = {id: 0, file: ''};
  selectVideo = {id: 0, file: ''};
  public spinerState = false;

  ngOnInit() {
    if (this.editingStore.state.activeMediaParam.type === 'image') {
      this.getPhotos();
      console.log(this.libStore.state.myPhoto);
    } else if (this.editingStore.state.activeMediaParam.type === 'video') {
      this.getVideo();
    }
    this.color = 'black';
    this.value = 50;
  }

  getPhotos = (): void => {
    if (this.libStore.state.myPhoto.length === 0) {
      this.spinerState = true;
      this.libService.getMyPhotos()
        .subscribe(data => {
          this.spinerState = false;
          console.log(data);
          data.forEach((image) => {
            this.libStore.saveOnePhoto(image);
          });
        }, error => {
        });
    }
  };

  getVideo = (): void => {
    if (this.libStore.state.myVideo.length === 0) {
      this.spinerState = true;
      this.libService.getMyVideos()
        .subscribe(data => {
          console.log(data);
          this.spinerState = false;
          this.libStore.saveMyVideos(data);

        }, error => {
          this.libStore.saveMyVideos([]);
          console.log(error);
        });
    }
  };

  // Check video Duration
  getVideosDuration() {
    const myVideos = this.libStore.state.myVideo;
    myVideos.map(video => {
      console.log(video);
      const binaryData = [];
      binaryData.push(video);

      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      videoElement.src = URL.createObjectURL(new Blob(binaryData, {type: 'video/mp4'}));
      videoElement.onloadedmetadata = function () {
        console.log(videoElement.duration);
      };
    });
  }


  selectPic(img) {
    console.log(img);
    this.selectImg = img;
  }

  selectVid(video) {
    console.log(video);
    this.selectVideo = video;
  }

  choosePic() {
    this.editingStore.storeMedia(this.selectImg.file);
    this.dialogRef.close(this.selectImg.file);
  }

  chooseVideo() {
    this.editingStore.storeMedia(this.selectVideo.file);
    this.dialogRef.close(this.selectVideo.file);
  }

  show(event) {
    this.uploadFile(event.target.files[0]);
  }

  uploadFile(file) {
    const bod = {project_id: this.editingStore.state.project.id, user_id: this.store.state.authCredentials.id};
    this.projectService.uploadFile(file, bod)
      .then(data => {
        console.log(data);
        console.warn('AAAAAAAAAAAAAAAAAA');
      }, error => {
        console.log(error);
      });
  }

}
