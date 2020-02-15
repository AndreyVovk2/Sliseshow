import {Component, OnInit, ViewChild, ElementRef, isDevMode} from '@angular/core';
// import { RoundedButtonComponent } from '../../components/rounded-button/rounded-button.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig} from '@angular/material';
// import {PopUpProjectNameComponent} from '../../components/pop-up-project-name/pop-up-project-name.component';
import {ActivatedRoute, Router} from '@angular/router';
// import { EditingStore} from './editing.store';
// import { EditingState } from './editing-state';
import {ProjectService} from '../../shared/services/project.service';
import {COMMON_URL} from '../../shared/services/common.url';
// import {EditingPopupComponent} from '../../components/editing-popup/editing-popup.component';
// import {CropVideoPopupComponent } from '../../components/crop-video-popup/crop-video-popup.component';
// import {CropImagePopupComponent } from '../../components/crop-image-popup/crop-image-popup.component';
// import { SocketService } from './socket-service';
import {HttpClient} from '@angular/common/http';
import {NotifierService} from 'angular-notifier';
import {Observable} from 'rxjs/Observable';
import {EditingStore} from '../store/editing.store';
import {SocketService} from '../socket-service';
import {TimelineStore} from '../timeline/timeline-store/timeline.store';
import {PopUpProjectNameComponent} from '../../shared/modals/pop-up-project-name/pop-up-project-name.component';
import {EditingState} from '../store/editing-state';
import {EditingPopupComponent} from '../editor-modals/editing-popup/editing-popup.component';
import {CropVideoPopupComponent} from '../editor-modals/crop-video-popup/crop-video-popup.component';
import {CropImagePopupComponent} from '../editor-modals/crop-image-popup/crop-image-popup.component';
import {AppStore} from '../../shared/store/app.store';
import {AuthService} from '../../shared/services/auth.service';
import {TimelineComponent} from '../timeline/timeline.component';


import {PARAMETERS} from '@angular/core/src/util/decorators';

// import { TimelineStore } from '../../components/timeline/timeline.store';


@Component({
  selector: 'app-editing-system',
  templateUrl: './editing-system.component.html',
  styleUrls: ['./editing-system.component.scss']
})
export class EditingSystemComponent implements OnInit {
  @ViewChild('fileInput', {read: ElementRef}) fileupload: ElementRef;
  @ViewChild('video') video: ElementRef;
  @ViewChild(TimelineComponent)
  private timelineComponent: TimelineComponent;
  private uploadedVideo;
  public projectID = null;
  public mediaTemp = {button: 0, type: '', link: '', name: ''};
  public ioConnection: any;
  public state = null;
  public checkStatus = false;
  public progressBar = 0.0001;
  public renderPercent = 90;
  public totalDuration = 0;
  public authParam;
  private limitSize;
  private generalLimit = 2147483648;


  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private rt: Router,
    public editingStore: EditingStore,
    public projectService: ProjectService,
    private socketService: SocketService,
    private timelineStore: TimelineStore,
    private readonly notifier: NotifierService,
    private httpClient: HttpClient,
    private appStore: AppStore,
    private authService: AuthService
  ) {

    this.route.params.subscribe(params => this.projectID = atob(params.id));

  }
@ViewChild('value') value: number;
  @ViewChild('color') color: number;
  load = false;

  ngOnInit(): void {
    // console.log(this.rt.snapshot.data['test']);

    // console.log(this.route.data.subscribe(v => console.log(v)));

    this.getDomain();
    this.subscribeStateUpdates();
    this.authService.getLimit();
    // this.fetchProjectData();

    // this._initIoConnection();
    // this.openImageCropDialog();
    this.value = 50;
    this.color = 50;
  }

  changePosition(direction: string, index = 1) {
    console.log(this.editingStore.state.project.animation);
    const animationArr = this.editingStore.state.project.animation;
    if (direction === 'left') {
      const temporary = JSON.parse(JSON.stringify(animationArr[index - 1]));
      animationArr[index - 1] = JSON.parse(JSON.stringify(animationArr[index]));
      animationArr[index] = JSON.parse(JSON.stringify(temporary));
    } else {
      const temporary = JSON.parse(JSON.stringify(animationArr[index + 1]));
      animationArr[index + 1] = JSON.parse(JSON.stringify(animationArr[index]));
      animationArr[index] = JSON.parse(JSON.stringify(temporary));
    }
    console.log(animationArr);
    console.log(this.editingStore.state.project.animation);
  }


  getAuthParam() {
    this.authParam = {
      token: JSON.parse(localStorage.getItem('currentUser')).token,
      project_id: this.editingStore.state.project.id
    };
    // this.socketConnection();
    // console.log(this.authParam);
    // this.setTimeCode();

  }

  test123() {
    this.editingStore.testFunc();
  }

  private getCheckObject() {
    const user_id = JSON.parse(localStorage.getItem('currentUser')).id;
    const project_id = this.projectID;
    const token = JSON.parse(localStorage.getItem('currentUser')).token;
    const checkObject = {user_id, project_id, token};
    return checkObject;
  }

  private _initIoConnection(): void {

    // console.log(this.editingStore.state.nodeDomain);
    console.log(this.editingStore.state.nodeDomain);
    this.socketService.initSocket(this.editingStore.state.nodeDomain);
    this.socketService.onload.next(true);

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: any) => {
        console.log(message);
      });

    this.socketService.onEvent('connect')
      .subscribe((data) => {
        this.socketService.sendEvent('auth', this.authParam);
      });

    this.socketService.onEvent('render-finished')
      .subscribe((data) => {
        // this.editingStore.changePosState = true;
        this.notifier.notify('success', 'Screen rendering finished!');
        console.log(data);

        this.editingStore.state.activeAnimationStyle.is_rendering = false;

        console.log(this.editingStore.state.activeAnimationStyle);
        this.editingStore.state.allTemplatesAreRendering = false;

        // TODO: instead of requesting to save new data // node.js should save this information
        // only request that video rendered should come on client side
        this.editingStore.saveRenderedTemplate(data);
        // this.editingStore.storeProjectData();
        this.editingStore.getCurrentVideoLink();


      });

    // this.socketService.onEvent('render-progress')
    //   .subscribe((data) => {
    //     this.progressBar = data.progress * this.renderPercent / 100;
    //     const prog = { template_id: data.animation_id, progress: this.progressBar};
    //     this.socketService.onload.emit(prog);
    //     // console.log(data, this.template.id);
    //     // if (+data.animation_id === this.template.id) {
    //     //   console.log(this.progressBar);
    //     // }
    // });

    // this.socketService.onEvent('convert-progress')
    //   .subscribe((data) => {
    //     this.progressBar = this.renderPercent + data.progress;
    //     const prog = { template_id: data.animation_id, progress: this.progressBar};
    //     this.socketService.onload.emit(prog);
    //     // console.log(data, this.template.id);
    //     // if (+data.animation_id === this.template.id) {
    //     //   console.log(this.progressBar);
    //     // }
    // });

    this.socketService.sendEvent('status-check', this.getCheckObject());
    this.socketService.onEvent('status-result').subscribe((data) => {
      // console.log(data);
      this.setRenderingActive(data);
      // console.log(this.editingStore.state);
    });

    this.socketService.onEvent('status-error').subscribe((data) => {
      console.log(data);
    });

    this.socketService.onEvent('render-error')
      .subscribe((data) => {
        // this.editingStore.changePosState = true;
        this.notifier.notify('error', 'Template render error!');
        console.log(data);
        this.editingStore.state.activeAnimationStyle.is_rendering = false;

        // TODO: instead of requesting to save new data // node.js should save this information
        // only request that video rendered should come on client side
        this.editingStore.templateRenderError(data);
      });

    // this.socketService.onEvent('reconnect_attempt').subscribe(() => {
    //   console.log('reconnect_attempt');
    // });
    //

    // this.socketService.onEvent('merge-progress')
    // .subscribe((data) => {
    //   console.log(data);
    // this.timeToEnd = data.timeToEnd;
    // console.log('Time to End:' + this.timeToEnd);
    // });

    this.socketService.onEvent('merge-end')
      .subscribe((data) => {
        console.log(data);
        this.editingStore.saveMerged(data.data);
        this.editingStore.statusCheckResult(false, this.editingStore.state.project.renderAndMerge);
        this.notifier.notify('success', 'Template merge finished!');
      });

    this.socketService.onEvent('merge-error').subscribe(() => {
      // this.editingStore.changePosState = true;
      this.editingStore.statusCheckResult(false, this.editingStore.state.project.renderAndMerge);
      console.log('merge-error');
    });

    this.socketService.onEvent('renderAndMerge-start').subscribe(() => {
      // this.editingStore.changePosState = false;
      console.log(this.editingStore.state.project);
      this.editingStore.statusCheckResult(this.editingStore.state.project.mergeStatus, true);
    });

    this.socketService.onEvent('renderAndMerge-finished').subscribe(() => {
      // this.editingStore.changePosState = true;
      this.editingStore.statusCheckResult(this.editingStore.state.project.mergeStatus, false);
    });

    this.socketService.onEvent('renderAndMerge-error').subscribe(() => {
      // this.editingStore.changePosState = true;
      this.editingStore.statusCheckResult(this.editingStore.state.project.mergeStatus, false);
    });

  }

  private setRenderingActive(data) {
    if (data.render.status === true) {
      this.editingStore.state.project.animation.forEach(v => {
        console.log(v);
        data.render.animations.forEach(q => {
          console.log(q);
          if (v.id === q) {
            v.is_rendering = true;
          }
        });
      });
    }
    this.editingStore.statusCheckResult(data.merge.status, data.renderAndMerge.status);

    // data.merge.status === true ? this.editingStore.state.project.mergeStatus = true :
    // this.editingStore.state.project.mergeStatus = false;
    // data.renderAndMerge.status === true ? this.editingStore.state.project.renderAndMerge = true :
    //   this.editingStore.state.project.renderAndMerge = false;
    // console.log(this.editingStore.state.project);
  }


  public changeDisableCheck() {
    console.log(this.editingStore.state.disableAutoRender);
    if (this.editingStore._isAnimationStyleCompleted(this.editingStore.state) && this.editingStore.state.disableAutoRender) {
      this.editingStore.projectRender(this.editingStore.state);
    } else {
      console.log('screens is not completed');
    }
    // console.log(this.editingStore.state.disableAutoRender);
  }


  openDialogProjectName = () => {
    console.log(this.editingStore.state.activeVideoLink);
    const dialogRef = this.dialog.open(PopUpProjectNameComponent, {
      data:
        {task: 'updateName', projectId: this.editingStore.state.project.id}
    });
    dialogRef.afterClosed().subscribe(
      (data) => {
        if (data.name !== '') {
          this.editingStore.state.project.name = data.name;
        }
        // console.log('Dialog output:', data);

      });
  };

  getDomain() {
    this.projectService.getRenderDomain()
      .subscribe(data => {
        console.log(data);
        isDevMode() ? this.editingStore.setDomain(data.dev) : this.editingStore.setDomain(data.prod);
        console.log(this.editingStore.state.nodeDomain);
        // isDevMode()
        // ? this.editingStore.setDomain('https://node.grassbusinesslabs.tk/')
        // : this.editingStore.setDomain('https://node1.grassbusinesslabs.tk/');
        this.fetchProjectData();
        this.load = true;
      });

  }

  setColor() {
    if (this.load === false) {
      return '0';
    } else {
      return '1';
    }
  }

  getColor() {
    console.log(this.editingStore.state);
    // this.socketService.disconnect();
  }

  testScroll(event) {
    console.log(event);
  }

  fetchProjectData = () => {
    if (this.projectID) {
      this.projectService.getProject(this.projectID)
        .subscribe((data: EditingState['project']) => {
          console.log(data);
          this.editingStore.saveProjectData(data);
          if (data.total_audio_duration > data.total_video_duration) {
            this.timelineComponent.createTime(data.total_audio_duration);
          } else {
            this.timelineComponent.createTime(data.total_video_duration);
          }


          this.getAuthParam();
          this._initIoConnection();
          this.timelineComponent.generateTimelineWidth();
        }, (error) => {
          this.timelineComponent.createTime(0);
        });
    } else {
      this.rt.navigate(['/']);
      console.warn('Project ID is not found');
    }
  };


  handlePic = (data, media) => {
    const mediaTemp = {...media, button: data};
    this.editingStore.setActiveMedia(mediaTemp);
    console.log(this.editingStore.state.activeMediaParam);
    if (!media.link && data === 1) {// upload from media library,
      this.openDialogMedia(media);
    } else if (media.link && data === 2) {// 2 for remove
      this.editingStore.removeMedia(media.name);
    } else if (!media.link && data === 2) {// upload from browse
      this.browseLocalFiles();
    } else if (media.link && data === 1) {// 1 for crop
      media.type === 'video' ? this.openCropDialog(media) : this.openImageCropDialog();
    }

  };

  browseLocalFiles = () => {
    this.fileupload.nativeElement.click();
  };

  checkFile(file) {
    // console.log(file);
    this.authService.getLimit();
    return this.checkFileType(file) && this.checkFileSize(file.size);
    // this.checkFileType();
    // this.checkFileSize();
  }

  checkFileType(fileType) {
    console.warn('checkFileType');
    const currentMedias = this.editingStore.getMedias();

    currentMedias.forEach(media => {
      if (fileType && fileType.type.includes(media.type)) {
        // if (fileType.type.includes(media.type) && fileType.size <= this.limitSize.used) {
        this.checkStatus = true;
        return this.checkStatus;
      } else {
        this.checkStatus = false;
        this.notifier.notify('error', 'Invalid file type');
      }
    });
    return this.checkStatus;
  }

  checkFileSize(fileSize) {
    console.warn('checkFileSize');
    const userUsed = JSON.parse(localStorage.getItem('currentUser')).used;
    if (fileSize <= this.generalLimit - userUsed) {
      return true;
    } else {
      this.notifier.notify('error', 'Too large file');
      return false;
    }
  }

  checkVideoDuration(file) {
    if (file && file.type.includes('video')) {
      if (this.checkAviFormat(file)) {
        const screenDuration = +this.editingStore.state.activeMediaParam.duration;
        const videoElement = document.createElement('video');
        videoElement.preload = 'metadata';
        videoElement.src = URL.createObjectURL(file);
        videoElement.onloadedmetadata = (event) => {
          const duration = videoElement.duration;
          if (duration > screenDuration) {
            console.log(duration);
            console.log(screenDuration);
            if (file && this.checkFile(file)) {
              this.uploadVideo(file);
            }
            return true;
          } else {
            this.notifier.notify('error', 'Too short video');
            return false;
          }
        };
      } else {
        return true;
      }
    }

  }

  checkAviFormat(file) {
    if (file.type.includes('avi')) {
      this.notifier.notify('error', 'Avi format is not supported');
      return false;
    } else {
      return true;
    }
  }

  handleFileUpload = (e) => {
    const {files} = this.fileupload.nativeElement;
    console.log(files);
    const file = files[0];
    console.log(this.editingStore.state.activeMediaParam);
    if (file.type.includes('video')) {
      this.checkVideoDuration(file);
    } else if (files && this.checkFile(files[0])) {
      const {token} = JSON.parse(localStorage.getItem('currentUser'));
      const urlVideo = COMMON_URL.library.video.one;
      const urlImage = COMMON_URL.library.photo.all_user;
      const url = files[0].type.slice(0, 5) === 'video' ? urlVideo : urlImage;
      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.addEventListener('readystatechange', (event: FileReaderEvent) => {
        if (xhr.readyState === 4 && xhr.status === 201) {
          // console.log('TCL: EditingSystemComponent -> handleFileUpload -> xhr.responseText', xhr.responseText);
          const response = JSON.parse(xhr.responseText);
          this.editingStore.storeMedia(response.file);
          files[0].type.slice(0, 5) === 'image' ? this.openImageCropDialog(response.file) : this.findVideoMedia();

        } else if (xhr.readyState === 4 && xhr.status !== 201) {
          console.log(xhr.responseText);
          this.notifier.notify('error', 'Some problems with file loading');
          try {
            console.log(JSON.parse(xhr.responseText));
          } catch (err) {
            console.log(err);
          }
        }
      });

      formData.append('file', file);
      formData.append('name', 'file');

      xhr.upload.onprogress = (event) => {
        console.log(event);
        const percentDone = Math.round(100 * event.loaded / event.total);
        console.log(percentDone);
      };

      xhr.send(formData);
    }

  };

  uploadVideo(file) {
    const {token} = JSON.parse(localStorage.getItem('currentUser'));
    const url = COMMON_URL.library.video.one;
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.addEventListener('readystatechange', (event: FileReaderEvent) => {
      if (xhr.readyState === 4 && xhr.status === 201) {
        // console.log('TCL: EditingSystemComponent -> handleFileUpload -> xhr.responseText', xhr.responseText);
        const response = JSON.parse(xhr.responseText);
        this.editingStore.storeMedia(response.file);
        this.findVideoMedia();

      } else if (xhr.readyState === 4 && xhr.status !== 201) {
        console.log(xhr.responseText);
        this.notifier.notify('error', 'Some problems with file loading');
        try {
          console.log(JSON.parse(xhr.responseText));
        } catch (err) {
          console.log(err);
        }
      }
    });

    formData.append('file', file);
    formData.append('name', 'file');

    xhr.upload.onprogress = (event) => {
      console.log(event);
      const percentDone = Math.round(100 * event.loaded / event.total);
      console.log(percentDone);
    };

    xhr.send(formData);
  }

  findVideoMedia() {
    this.editingStore.state.activeTemplate.medias.map((media, index) => {
      if (media.composition === this.editingStore.state.activeMediaParam.composition) {
        console.log(media);
        this.openCropDialog(media);
      }
    });
  }

  // postFile(fileToUpload: File) {
  //   const endpoint = COMMON_URL.library.video.one;
  //   const formData: FormData = new FormData();
  //   formData.append('fileKey', fileToUpload, fileToUpload.name);
  //   return this.httpClient
  //     .post(endpoint, formData);
  //     // .map(() => true)
  //     // .catch((e) => {
  //     //   console.log(e);
  //     //   return Observable.throw(e.statusText);
  //     // });
  // }

  openDialogMedia(media) {
    const dialogRef = this.dialog.open(EditingPopupComponent);
    this.editingStore.clearTemplate(4);
    dialogRef.afterClosed().subscribe((data) => {
      console.log(data);
      if (data && this.editingStore.state.activeMediaParam.type === 'image') {
        this.openImageCropDialog(data);
      } else if (this.editingStore.state.activeMediaParam.type === 'video') {
        this.openCropDialog(media);
      }
    });
  }

  openCropDialog(media) {
    const dialogConfig = new MatDialogConfig();
    let dialogRef;
    console.log(media);
    dialogConfig.data = media;
    if (media.link) {
      dialogRef = this.dialog.open(CropVideoPopupComponent, dialogConfig);
      // this.editingStore.state.cropOpened = true;
    }

    //   dialogRef.afterClosed().subscribe( (data) => {
    //     // this.editingStore.state.cropOpened = false;
    // });

  }

  openImageCropDialog(link = '') {
    const dialogConfig = new MatDialogConfig();
    let dialogRef;
    if (link !== '') {
      dialogConfig.data = {link};
      dialogRef = this.dialog.open(CropImagePopupComponent, dialogConfig);
      // this.editingStore.state.cropOpened = true;
    } else if (this.editingStore.state.activeTemplate.cropPosition) {
      dialogConfig.data = this.editingStore.state.activeTemplate.cropPosition;
      dialogRef = this.dialog.open(CropImagePopupComponent, dialogConfig);
      // this.editingStore.state.cropOpened = true;
    } else {
      dialogRef = this.dialog.open(CropImagePopupComponent);
      // this.editingStore.state.cropOpened = true;
    }

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.saveCropData(data);
      }
      // this.editingStore.state.cropOpened = false;
    });
  }

  saveCropData(data) {
    this.editingStore.state.activeTemplate.crop = data.crop;
    this.editingStore.state.activeTemplate.cropPosition = data.position;
    this.editingStore.saveProject(this.editingStore.state.project);
  }

  showText(e) {
  }


  renderBtnValid() {
    if (this.editingStore.state.project) {
      return this.editingStore.state.disableAutoRender
        || this.editingStore.state.project.mergeStatus
        || this.editingStore.state.project.renderAndMerge
        || this.checkIsRendering()
        || !this.checkScreensComplete();
    } else {
      return false;
    }

  }

  checkIsRendering() {
    if (this.editingStore.state.activeAnimationStyle && !this.editingStore.state.activeAnimationStyle.is_rendering) {
      return false;
    } else {
      return true;
    }
  }

  checkScreensComplete() {
    if (this.editingStore.state.activeAnimationStyle && this.editingStore.state.activeAnimationStyle.screens) {
      this.editingStore.waterMarkValid();
      return this.editingStore.state.activeAnimationStyle.screens.every(screen => screen.completed === true);
    } else {
      return false;
    }

  }


  hideText(e, text, i) {
    this.editingStore.storeText(text.value, i);
  }

  subscribeStateUpdates = (): void => {
    this.editingStore.state$.subscribe(state => {
      // console.log('---------');
      // console.log(state);
      // console.log('---------');
    });
    this.timelineStore.state$.subscribe(state => {
      //   if (state.audioTracks) {
      //     console.log('#####');
      //     console.log(state);
      //     console.log('#####');
      //   }
    });
  };

}
