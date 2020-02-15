import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  ViewEncapsulation,
  Renderer2,
  Input
} from '@angular/core';

import {MatDialog} from '@angular/material';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';
import {LibraryService} from '../../shared/services/library.service';
import {TimelineStore} from './timeline-store/timeline.store';
import {EditingStore} from '../store/editing.store';
import {EditingState} from '../store/editing-state';
import {PopUpDonateComponent} from '../editor-modals/pop-up-donate/pop-up-donate.component';
import {Router} from '@angular/router';
import {AppStore} from '../../shared/store/app.store';

import {ScissorsComponent} from '../editor-components/scissors/scissors.component';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [TimelineStore]
})
export class TimelineComponent implements OnInit, AfterViewInit, OnDestroy {
  // public nodeUrl = nodeUrl;
  @Input() private totalDuration = 0;
  @Input() private projectId: any;
  public nodeUrl;
  private pixelForSec = 16;
  public timePlacement = -32;
  public timeSci = 0;
  load = false;
  public timeArray = [];

  private elementWidth = 0;
  private draggingElementId = 0;
  private isTimepickerClicked = false;
  public draggable = true;
  private dragPosition = 0;

  // @Input() progress: number;
  @ViewChild('audiofirst', {read: ElementRef}) audiofirst: ElementRef;
  @ViewChild('audiolast', {read: ElementRef}) audiolast: ElementRef;
  @ViewChild('timeline', {read: ElementRef}) timeline: ElementRef;
  @ViewChild('screenContainer', {read: ElementRef}) screenContainer: ElementRef;
  @ViewChild(ScissorsComponent) scissors: ScissorsComponent;
  // @ViewChild('timepicker', { read: ElementRef }) timepicker: ElementRef;

  private _clickDelta = 0;
  private _offsetX = 0;

  private set offsetX(value: number) {
    this._offsetX = value;
  }

  private get offsetX() {
    return this._offsetX;
  }

  private set clickDelta(value: number) {
    this._clickDelta = value;
  }

  private get clickDelta() {
    return this._clickDelta;
  }

  // --------------------------------------
  //  Class variables
  // --------------------------------------

  constructor(
    public store: TimelineStore,
    public dialog: MatDialog,
    public appStore: AppStore,
    public _sanitizer: DomSanitizer,
    public libraryService: LibraryService,
    public renderer: Renderer2,
    public editingStore: EditingStore,
    private rt: Router,
    private el: ElementRef
  ) {
  }

  test1Scroll(event) {
    if (this.scissors && this.scissors.timeCounter && this.store.state.scissorsPosition > 0 && event.target.scrollLeft >= this.dragPosition) {
      console.log('first condition');
      this.store.state.scissorsPosition = this.store.state.scissorsPosition + (event.target.scrollLeft - this.dragPosition);
      this.scissors.timeCounter = this.scissors.timeCounter + (event.target.scrollLeft - this.dragPosition);
      // this.scissors.timeCounter = this.scissors.timeCounter + event.target.scrollLeft;
    } else if (this.scissors && this.scissors.timeCounter && this.store.state.scissorsPosition > 0 && event.target.scrollLeft < this.dragPosition) {
      console.log('second condition');
      this.store.state.scissorsPosition = this.store.state.scissorsPosition - (this.dragPosition - event.target.scrollLeft);
      this.scissors.timeCounter = this.scissors.timeCounter - (this.dragPosition - event.target.scrollLeft);
    } else {
      if (this.scissors && this.scissors.timeCounter) {
        this.store.state.scissorsPosition = event.target.scrollLeft;
        this.scissors.timeCounter = event.target.scrollLeft;
      }

    }
    this.dragPosition = event.target.scrollLeft;
  }


  ngOnInit() {
    this.nodeUrl = this.editingStore.state.nodeDomain;
    this.subscribeStateUpdates();
    this.initiEventListeners();
    this.fetchMySongs();
    this.fetchSuggestionSongs();
    this.generateTimelineWidth();
    // this.getProject(this.projectId);
    // this.createTime(this.totalDuration);
  }

  ngOnDestroy() {
    this.destroyEventListeners();
  }

  scrollEvent(event) {
    console.log(event);
  }


  ngAfterViewInit(): void {

  }

  initiEventListeners(): void {
    document.getElementById('timeline').addEventListener('scroll', this.handleTimlineScroll, true);
    document.getElementById('content').addEventListener('scroll', this.handleContentScroll, true);
  }

  destroyEventListeners(): void {
    document.getElementById('timeline').removeEventListener('scroll', this.handleTimlineScroll, true);
    document.getElementById('content').removeEventListener('scroll', this.handleContentScroll, true);
  }

  test(event) {
    console.log(event);
    const screen = this.screenContainer.nativeElement;
    screen.clientWidth += event.scrollLeft;
    console.log(this.screenContainer);
  }


  // ----------------------------------------------------------------------------
  //  Handlers
  // ----------------------------------------------------------------------------

  // --------------------------------------
  //  Zoom handlers
  // --------------------------------------

  handleZoomIn = (): void => {
    // const newValue = this.store.state.zoomValue + 0.1;
    // this.store.updateZoomValue(newValue);
    if (this.store.state && this.store.state.zoomValue >= 1 && this.store.state.zoomValue < 2) {
      const newValue = this.store.state.zoomValue + 0.1;
      this.store.updateZoomValue(newValue);
    }

  };

  handleZoomOut = (): void => {
    // const newValue = this.store.state.zoomValue - 0.1;
    // this.store.updateZoomValue(newValue);
    if (this.store.state && this.store.state.zoomValue > 1 && this.store.state.zoomValue <= 2) {
      const newValue = this.store.state.zoomValue - 0.1;
      this.store.updateZoomValue(newValue);
    }

  };

  handleZoomChange = (value): void => {
    console.log(value);
    this.store.updateZoomValue(value);
  };

  // --------------------------------------
  //  Volume handlers
  // --------------------------------------

  handleFadeInClick(trackId): void {
    this.store.toggleFadeIn(trackId);
  }

  handleFadeOutClick(trackId): void {
    this.store.toggleFadeOut(trackId);
  }

  handleVolumeClick(event): void {
    this.store.toggleVolumePopup();
    this.store.state.isVolumePopupOpened ? this.draggable = false : this.draggable = true;
  }

  handleVolumeChange = (trackId, volume): void => {
    console.log(trackId);
    console.log(+volume);
    this.store.updateTrackVolume(trackId, +volume);
  };

  // --------------------------------------
  //  Scroll handlers
  // --------------------------------------

  handleTimlineScroll(event): void {
    document.getElementById('content').scrollLeft = event.target.scrollLeft;
  }

  handleContentScroll(event): void {
    document.getElementById('timeline').scrollLeft = event.target.scrollLeft;
  }

  // SCISSORS
  setDraggableClass(event, value) {
    if (value) {
      event.target.draggable = true;
    } else {
      event.target.draggable = false;
    }
    console.log(event.target, event.target.draggable);
  }

  moveScissors(event) {
    console.log(event.scrElement.offsetParent, '000');
    const isActive = event.scrElement.offsetParent.draggable;
    if (isActive) {
      event.event.scrElement.offsetParent.offsetLeft = event.offsetX;
      console.log(event, event.offsetX);
    }
  }

  // --------------------------------------
  //  D&D
  // --------------------------------------

  // --------------------------------------
  //  Tracks
  // --------------------------------------

  handleDragStartTrack = (event): void => {
    // console.log(event);
    // console.log(this.store.state.audioTracks);
    event.dataTransfer.setData('text', 'Data from drag start');
    const scrollPosition = document.getElementById('content').scrollLeft;
    const mousePosition = event.clientX - event.target.offsetLeft - 252 + scrollPosition;
    const clientRekt = event.target.getBoundingClientRect();
    this.elementWidth = clientRekt.width;
    const draggingTrack = this.store.getTrackById(event.target.id);
    if (draggingTrack) {
      this.store.saveDraggingTrack(draggingTrack, mousePosition);
      event.currentTarget.style.transform = 'scale(0)';
    } else {
      // TODO: handle if track isn't valid
    }
  };

  // not used now
  handleDragenterTrack(event): void {
    event.preventDefault();
  }

  handleDragoverTrack(event): void {
    event.preventDefault();
    this.offsetX = event.offsetX;
  }

  handleDropTrack = (event) => {
    this.findLastAudioPos();
    console.log(event);
    console.log('handleDropTrack');
    event.preventDefault();
    const drag = this.store.state.draggingTrack;
    const offsetX = Number(event.offsetX);
    const parentStart = drag.playFrom * drag.width / (drag.playTo - drag.playFrom);
    const startPosition = offsetX - this.store.state.clickedTrackMousePosition;
    // const startPosition = offsetX;
    // const endPosition = this.clickDelta < 0 ? offsetX + Math.abs(this.clickDelta) : offsetX - Math.abs(this.clickDelta);
    const endPosition = startPosition + this.elementWidth;
    const containerWidth = event.target.clientWidth;
    // const checkEdge = ((endPosition + this.elementWidth / 2) < containerWidth + 2) && startPosition > -4;
    const elements = event.target.children;
    console.log(this.store.state);

    // if (event.target.id === 'audio-container-first' && checkEdge && !this._checkCollision(elements)) {&& !this.checkOverlay(elements)
    if (event.target.id === 'audio-container-first' && !this._checkCollision(elements) && this.checkDraggable(1, startPosition, endPosition)) {
      this.store.updateTracks({
        ...this.store.state.draggingTrack,
        id: this.store.state.draggingTrack.id,
        startPosition: startPosition,
        container: 1,
        parentTrackStart: startPosition - parentStart
      });
      this.editingStore.saveProject(this.editingStore.state.project);
      // } else if (event.target.id === 'audio-container-last' && checkEdge && !this._checkCollision(elements)) {&& !this.checkOverlay(elements)
    } else if (event.target.id === 'audio-container-last' && !this._checkCollision(elements) && this.checkDraggable(2, startPosition, endPosition)) {
      this.store.updateTracks({
        ...this.store.state.draggingTrack,
        id: this.store.state.draggingTrack.id,
        startPosition: startPosition,
        container: 2,
        parentTrackStart: startPosition - parentStart
      });
      this.editingStore.saveProject(this.editingStore.state.project);
    } else {
      console.log('not compatible container');
    }

  };

  checkDraggable(containerId, startPos, endPos) {
    console.log(startPos);
    console.log(endPos);
    let draggable = true;
    if (startPos < 0) {
      console.log('FIRST IF');
      draggable = false;
      return draggable;
    }
    for (let i = 0; i < this.store.state.audioTracks.length; i++) {
      if (this.store.state.audioTracks[i].container === containerId && this.store.state.audioTracks[i].id != this.draggingElementId) {
        console.log(this.store.state.audioTracks[i]);
        const audioEnd = this.store.state.audioTracks[i].startPosition + this.store.state.audioTracks[i].width;
        const currAudio = this.store.state.audioTracks[i];
        if (startPos < 0) {
          console.log('SECOND IF');
          draggable = false;
          break;
        } else if ((currAudio.startPosition >= startPos && currAudio.startPosition >= endPos) || (audioEnd <= startPos && audioEnd <= endPos)) {
          draggable = true;
          console.log('THIRD IF');
          // break;
        } else {
          draggable = false;
          break;
        }
      }

    }
    console.log(draggable);
    return draggable;
  }


  handleDragEndTrack(event): void {
    event.preventDefault();
    event.stopPropagation();
    event.target.classList.remove('dragging');
    event.currentTarget.style.transform = 'scale(1)';
    // this.editingStore.saveProject(this.editingStore.state.project);

  }

  // --------------------------------------
  //  Clicks
  // --------------------------------------
  //  Tracks
  // --------------------------------------

  handleMouseDownTrack(event): void {
    const isActive = event.target.classList.contains('dragging');
    const elRekt = event.target.getBoundingClientRect();
    this.clickDelta = event.clientX - elRekt.right + (elRekt.width / 2);
    this.draggingElementId = event.target.id;
    this._cleanClassesByName('dragging');
    if (isActive) {
      event.target.classList.remove('dragging');
    } else {
      event.target.classList.add('dragging');
    }
    event.target.classList.remove('active-track');
  }

  handleMouseUpTrack(event): void {
    // event.target.classList.remove('dragging');
  }


  handleMouseoverTrack = (event): void => {
    if (event.target.classList.contains('audio-sector')) {
      this.store.closeVolumePopup();
      this.store.updateActiveTrack(event.target.id);
      this.draggable = true;
    }
  };

  // handleMouseleaveTrack = (): void => {
  //   this.store.closeVolumePopup();
  //   this.store.updateActiveTrack(null);
  // }

  handleDeleteClick(trackId, path, width): void {
    console.log(width);
    this.store.deleteTrack(trackId, path, width);
    this.draggable = true;
  }

  // --------------------------------------
  //  Screens
  // --------------------------------------

  handleScreenDragStart = (video): void => {
    this.store.saveDraggingVideo(video);
  };

  handleDragenterScreen(event): void {
    event.preventDefault();
    // console.log('dragenter');
  }

  handleDragoverVideo(event): void {
    event.preventDefault();
  }

  handleScreenDrop = (event) => {
    event.preventDefault();
    this.store.updateScreens({
      ...this.store.state.draggingScreen,
      startPosition: Number(event.offsetX),
    });
  };


  // --------------------------------------
  //  Handle time-picker
  // --------------------------------------

  handleTimePickerMouseDown = (): void => {
    this.isTimepickerClicked = !this.isTimepickerClicked;
  };

  handleTimePickerMouseUp = (): void => {
    this.isTimepickerClicked = !this.isTimepickerClicked;
  };

  toggleTimepicker = (): void => {
    this.isTimepickerClicked = !this.isTimepickerClicked;
  };

  // handleTimelineClick = (event): void => {
  //   this.renderer.setStyle(this.timepicker.nativeElement, 'left', (event.layerX - 2) + 'px');
  // }

  // --------------------------------------
  //  Screens
  // --------------------------------------

  handleClickScreen(template: EditingState['activeTemplate']): void {
    this.editingStore.setActiveTemplate(template);
  }

  generateWidth = (duration): number => {
    return this.framesToSeconds(duration) * 32;
  };

  framesToSeconds = (frames): number => {
    const FPS = 30;
    return frames / FPS;
  };

  // --------------------------------------
  //  Media
  // --------------------------------------

  handleAddMediaClick(): void {
    this.store.toggleMediaState();
    this.load = true;
  }

  // --------------------------------------
  //  Add more slices
  // --------------------------------------

  addMoreSlice() {
    const selectedSlices = [];
    console.log(this.editingStore.state);
    this.editingStore.state.project.animation.map(item => {
      selectedSlices.push(item);
    });
    const addSliceData = {
      addSlice: true,
      selectedSlices: selectedSlices,
      projectId: this.editingStore.state.project.id
    };
    console.log(addSliceData);
    this.appStore.saveAddSliceData(addSliceData);
    this.rt.navigate(['../../create-project/step-one']);
  }

  // --------------------------------------
  //  Utils
  // --------------------------------------

  _cleanClassesByName(className: string): void {
    const activeElement: any = document.getElementsByClassName(className);

    for (const element of activeElement) {
      element.classList.remove(className);
    }
  }

  openDialogDonate() {
    this.dialog.open(PopUpDonateComponent, {});
  }

  getSliderImage = (volume: number): SafeStyle => {
    return this._sanitizer.bypassSecurityTrustStyle(`
        -webkit-gradient(
            linear,
            left top,
            right top,
            color-stop(${volume / 100}, #fcbf51),
            color-stop(${volume / 100}, #291E2F)
        )
        `);
  };

  cancelDrag(id): void {
    document.getElementById(id).setAttribute('draggable', 'false');
  }

  renewDrag(id): void {
    document.getElementById(id).setAttribute('draggable', 'true');
  }

  // generateTimeUnits(): void {
  //   let timePlacement = -8;
  //   const unitsCount = this.timeline.nativeElement.offsetWidth / 160;
  //   for (let i = 0; i < unitsCount; i++) {
  //     this.timeline.nativeElement.insertAdjacentHTML('beforeend',
  //       `<div
  //         style="position: absolute; top: -25px; left: ${timePlacement * this.store.state.zoomValue}px;"
  //         class="time-unit"
  //       >${this.timeArray[i]}</div>`
  //     );
  //     timePlacement += 160;
  //   }
  // }

  _checkCollision(elements) {
    // console.log(elements);
    return Array.prototype.some.call(elements, item => {
      if (item.id !== this.draggingElementId) {
        // console.log(item);
        return this._isCollide(item);
      }
    });
  }

  _isCollide(b) {
    const right = b.offsetLeft + b.clientWidth - 5;
    // const right = b.offsetLeft + this.elementWidth - 5;
    // const right = b.offsetLeft + b.e;
    const left = b.offsetLeft + 5;
    // Half of draggeble track
    const halfWidth = (this.elementWidth / 2);


    const center = this.clickDelta < 0 ? this.offsetX + Math.abs(this.clickDelta) : this.offsetX - Math.abs(this.clickDelta);


    return (center - halfWidth < right && center - halfWidth > left
      || center + halfWidth > left && center + halfWidth < right);
    // return (/*center - halfWidth < right && */center - halfWidth > left);
  }

  createTime(time: any): any {
    this.timeArray = [];
    const dur = (+time / 60) + 1;
    const sec = ':00';
    for (let i = 0; i < dur; i++) {
      if (i < 10) {
        for (let y = 0; y < 6; y++) {
          this.timeArray.push('0' + i + ':' + y + '0' + sec);
        }
      } else {
        for (let y = 0; y < 6; y++) {
          this.timeArray.push(i + ':' + y + '0' + sec);
        }
      }
    }
    // console.log(this.timeArray);
    return this.timeArray;
  }

  // --------------------------------------
  //  Requests
  // --------------------------------------

  fetchMySongs = (): void => {
    this.libraryService.getMySongs()
      .subscribe((data) => {
        this.store.storeSongs(data);
      });
  };

  fetchSuggestionSongs = (): void => {
    this.libraryService.getSuggestionSongs()
      .subscribe((data) => {
        this.store.storeSuggestionSongs(data);
      });
  };

  getUnitPosition = (i) => {
    if (i === 0) {
      return -32 + 'px';
    }
    // return ((160 * this.store.state.zoomValue) * i) - 32 + 'px';
    return ((160 * this.store.state.zoomValue) * i) - 32 + 'px';
  };

  subscribeStateUpdates = (): void => {
    this.store.state$.subscribe(state => {
      // console.log(state);
      this.editingStore.saveTimeline(state);
    });
    this.editingStore.state$.subscribe(state => {
      if (state.project) {
        // console.log(state.project.animation.screens);
      }
    });
  };

  generateTimelineWidth = () => {
    if (this.editingStore.state.project) {
      const el = this.screenContainer.nativeElement;
      const parentWidth = el.offsetParent.clientWidth;
      // const iterations = +this.editingStore.state.project.total_video_duration * 16;
      const video_dur = +this.editingStore.state.project.total_video_duration;
      const audio_dur = +this.editingStore.state.project.total_audio_duration;
      let iterations;
      if (video_dur > audio_dur) {
        iterations = +this.editingStore.state.project.total_video_duration * 16;
      } else {
        iterations = +this.editingStore.state.project.total_audio_duration * 16;
      }
      // iterations = +this.editingStore.state.project.total_video_duration * 16;
      const widthInPX = iterations * this.store.state.zoomValue;
      this.totalDuration = Math.round(+this.editingStore.state.project.total_video_duration);

      if (parentWidth > widthInPX) {
        // Я хз чому так...
        this.store.setTimelineWidth(parentWidth + 70);
        // console.log('first if');
        return parentWidth + 70 + 'px';
      } else {
        this.store.setTimelineWidth(widthInPX + 233);
        return widthInPX + 233 + 'px';
      }
    } else {

      return '100vw';
    }


  };

  countAudioWidth() {
    let audioWidth = 0;
    const pixForComfort = 400;
    if (this.editingStore.state.project && this.editingStore.state.project.audio) {
      this.editingStore.state.project.audio.map(track => {
        audioWidth += track.width;
      });
      const lastAudioPos = this.findLastAudioPos();
      if (lastAudioPos > audioWidth && lastAudioPos > this.store.state.timeineWidth) {
        return lastAudioPos * this.store.state.zoomValue + pixForComfort + 'px';
      } else if (audioWidth > this.store.state.timeineWidth) {
        return audioWidth * this.store.state.zoomValue + pixForComfort + 'px';
      } else {

        return this.generateTimelineWidth();
      }
    } else {
      // console.log('THE LAST ONE Else');
      return this.generateTimelineWidth();
      // return '100vw';
    }

  }

  findLastAudioPos(): number {
    let songPosition = 0;
    let totalSongDuration = 0;
    if (this.checkAudio()) {
      this.editingStore.state.project.audio.map(song => {
        if (song.startPosition > songPosition) {
          songPosition = song.startPosition;
          totalSongDuration = song.startPosition + song.width;
        }
      });
    }

    return totalSongDuration;
  }

  checkAudio() {
    return this.editingStore.state.project && this.editingStore.state.project.audio;
  }
}


