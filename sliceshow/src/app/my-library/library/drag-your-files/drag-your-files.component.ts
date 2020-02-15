import {Component, OnInit, Inject, OnDestroy, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {LibraryService} from '../../../shared/services/library.service';
import {COMMON_URL} from '../../../shared/services/common.url';
import {Utility} from '../../../shared/services/utility.service';
import {LibraryStore} from '../../store/library.store';
import {AuthService} from '../../../shared/services/auth.service';
import {NotifierService} from 'angular-notifier';
import {RequestService} from '../../../shared/services/request.service';
import {LibraryMyPhotosComponent} from '../library-my-photos/library-my-photos.component';
import {EditingStore} from '../../../editor/store/editing.store';


@Component({
  selector: 'app-drag-your-files',
  templateUrl: './drag-your-files.component.html',
  styleUrls: ['./drag-your-files.component.scss']
})
export class DragYourFilesComponent implements OnInit, OnDestroy {
  @ViewChild('bufferVlue') bufferVlue: number;
  @ViewChild('value') value: number;
  // @ViewChild('valueProgres') valueProgres: number;
  public valueProgres = 0;
  public Secondvalue = 0;
  // @ViewChild('progres') progres: number;
  public progres = 6;
  public loading: boolean;
  public progress = 0;
  public subscriber;
  public subscriber_2;

  private generalLimit = 2147483648;
  isLoaded = false;

  // @HostBinding('style.border') private border = '1px dashed #edf2fa';

  constructor(public utility: Utility, public dialog: MatDialog, public dialogRef: MatDialogRef<DragYourFilesComponent>,
              public library: LibraryService, @Inject(MAT_DIALOG_DATA) public data: any,
              private store: LibraryStore,
              private authService: AuthService,
              private notifier: NotifierService,
              private request: RequestService,
              private libraryMyPhotosComponent: LibraryMyPhotosComponent,
              public stors: EditingStore) {
  }

  // return this.request.get(`${COMMON_URL.pricing.one}${id}`)
  show(files: FileList) {
    console.log(files, '1');
    // let i = 0;
    const image = new FormData();
    console.log(image, '222');


    for (let i = 0; i < files.length; i++) {
        image.append('photos' + `[${i}]`, files[i]);
    }

    this.library.addPhoto(image).subscribe(res => {
      this.libraryMyPhotosComponent.getPhotos();
      this.valueProgres++;
      // this.Secondvalue++;
      console.log(res);
    });
// tslint:disable-next-line:no-debugger
    console.log(event);
    switch (this.store.state.currentPage) {
      case 'myPhoto':
        this.uploadPhoto(event.target[0]);
        // Object.keys(files).forEach(function (key) {
        //   // console.log(files[key]);
        //   this.dndDirect.nativeElement._handlePhotoUpload(files[key]);
        // });
        // console.log('PHOTOS');
        // Array.prototype.forEach.call(event.target.files, this.dndDirect._handlePhotoUpload(file));
        break;
      case 'myVideo':
        this.uploadVideo(event.target[0]);
        break;
      case 'myMusic':
        this.uploadMusic(event.target[0]);
        break;
    }
  }

  ngOnInit() {
    this.authService.getLimit();
    this.subscriber = this.utility.progress.subscribe(prog => {
      this.progress = +prog;
    });
    this.subscriber_2 = this.utility.isLoading.subscribe(prog => {
      this.loading = prog;
    });
    this.bufferVlue = 0;
    this.value = 50;
  }


  // @HostListener('mouseenter') onMouseEnter() {
  //   console.log('I AM HERE');
  // }
  // @HostListener('mouseleave') onMouseLeave() {
  //   console.log('I AM NOT HERE');
  // }


  // @HostListener('dragover', ['$event']) public onDragOver(event) {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   console.log('dragover');
  //   // this.border = '2px dashed #edf2fa';
  //
  // }
  //
  // @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
  //   evt.preventDefault();
  //   evt.stopPropagation();
  //   // this.border = '2px dashed #edf2fa';
  //
  // }
  //
  //
  //
  // @HostListener('drop', ['$event']) onDrop(event) {
  //   event.preventDefault();
  //   event.stopPropagation();
  //
  //   const files = event.dataTransfer.files;
  //   console.log(files);
  // }


  closePop() {
    console.log(this.store.state);
    this.dialogRef.close();
  }


  uploadPhoto(file) {
    console.log(file);
    if (file && this.checkFile(file.size) && this.checkFileType(file, 'image')) {
      this.loading = true;
      this.utility.uploadPhoto(file)
        .then(data => {
          this.loading = false;
          this.authService.getLimit();
          console.log(data);
          this.store.saveOnePhoto(JSON.parse(data));
          this.closePop();
        }, error => {
          console.log(error);
        });
    }
  }

  uploadVideo(file) {
    console.log(file);
    if (file && this.checkFile(file.size) && this.checkFileType(file, 'video')) {
      this.utility.uploadVideo(file)
        .then(data => {
          this.authService.getLimit();
          this.store.saveMyVideo(JSON.parse(data));
          this.closePop();
        }, error => {
          console.log(error);
        });
    }
  }

  uploadMusic(file) {
    console.log(file);
    if (file && this.checkFile(file.size) && this.checkFileType(file, 'audio')) {
      this.utility.uploadMusic(file)
        .then(data => {
          this.authService.getLimit();
          this.store.updateMyMusic(JSON.parse(data));
          this.closePop();
        }, error => {
          console.log(error);
        });
    }
  }

  checkFile(fileSize) {
    console.log(fileSize);
    const userUsed = JSON.parse(localStorage.getItem('currentUser')).used;

    if (fileSize <= this.generalLimit - userUsed) {
      return true;
    } else {
      this.notifier.notify('error', 'Too large file');
      return false;
    }
  }

  checkFileType(file, type) {
    if (file.type.includes(type)) {
      return true;
    } else {
      this.notifier.notify('error', 'Wrong file type');
      return false;
    }
  }

//////////////////

  // _handlePhotoUpload = (file): void => {
  //   const currentTimestamp = + new Date();
  //
  //   this.store.addPendingPhoto({
  //     id: currentTimestamp,
  //     name: file.name
  //   });
  //
  //   this.dialogRef.close();
  //
  //   this.utility.uploadPhoto(file)
  //     .then(data => {
  //       this.store.saveMyPhoto(JSON.parse(data));
  //       this.store.removePendingPhoto(currentTimestamp);
  //     }, error => {
  //       this.store.removePendingPhoto(currentTimestamp);
  //       this.notifier.notify('info', 'Some error occured, please try again!');
  //       console.log(error);
  //     });
  // }


  ///////////////////////////////////////


  ngOnDestroy() {
    this.subscriber.unsubscribe();
    this.subscriber_2.unsubscribe();
  }

  getVideoLink = () => {
    const date = +new Date().getTime();
    // console.log(date);
    const i = this.findIndex();
    // console.log(i);
    this.isLoaded = true;
    if ('video_stream' in this.stors.state.activeAnimationStyle) {
      return this.stors.state.activeAnimationStyle.video_stream;
    } else if (this.stors.state.project.animation[i].preview_video) {
      return this.stors.state.project.animation[i].preview_video;
    } else {
      this.isLoaded = false;
      return '';
    }

  };

  findIndex() {
    const idx = this.stors.state.project.animation
      .findIndex(x => x.id === this.stors.state.activeAnimationStyle.id);
    return idx;
  }
}
