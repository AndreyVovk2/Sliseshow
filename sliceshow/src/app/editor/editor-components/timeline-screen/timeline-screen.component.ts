import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { EditingStore } from '../../store/editing.store';
import { TimelineStore } from '../../timeline/timeline-store/timeline.store';
import { SocketService } from '../../socket-service';
import { EditingState } from '../../store/editing-state';
import { ContactUsRoutingModule } from '../../../contact-us/contact-us.routing';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';
import { DeleteSlicePopupComponent } from '../../editor-modals/delete-slice-popup/delete-slice-popup.component';


@Component({
  selector: 'app-timeline-screen',
  templateUrl: './timeline-screen.component.html',
  styleUrls: ['./timeline-screen.component.scss']
})
export class TimelineScreenComponent implements OnInit, OnDestroy {
  @Input() template: any;
  @Input() position: number;
  @Input() progress: number;
  @ViewChild('scren01') templateT: ElementRef;

  // progressBar = 0;
  public renderPercent = 100;
  public progressBar = 0.0001;
  public ioConnection: Subscription;

  duration = 0;
  ovenLeft;

  constructor(public editingStore: EditingStore,
              private dialog: MatDialog,
              public timelineStore: TimelineStore,
              private socketService: SocketService) {}


  ngOnInit() {
    console.log(this.template);
    console.log(this.position);
    this.ovenLeft = this.templateT.nativeElement.offsetLeft;
    this.duration = +this.template.duration * 30;
    // setTimeout(this._initIoConnection(), 0);
    // this.watchSocketConnection();
    // this.ioConnection = this.socketService.onload.subscribe(data => {
    //   console.log(data);
    //   this.progressBar = data.progress;
    //   // if (data.template_id === this.template.id) {
    //   // }
    // });
      const subject = this.socketService.onload.asObservable();
      this.ioConnection = subject.subscribe(data => {
        // console.log(data);
        if (data) {
          this._initIoConnection();
        }
      });

  }

  // watchSocketConnection() {
  //   this.ioConnection = this.socketService.onload.subscribe(data => {
  //     console.log('TS connection:', data);
  //     if (data) {
  //       this._initIoConnection();
  //     } else {
  //       setTimeout(this.watchSocketConnection, 100);
  //     }
  //   });
  // }

  public _initIoConnection(): void {
    console.log(this.template.id);

    this.socketService.onEvent('render-progress')
    .subscribe((data) => {
      if (+data.animation_id === this.template.id) {
        console.log(this.progressBar);
        this.template.is_rendering = true;
        this.progressBar = data.progress * this.renderPercent / 100;

      }

    });

    this.socketService.onEvent('render-finished').subscribe( (data) => {
      console.log('render-finished SOCKET');
      console.log(this.template);
      this.progressBar = 0.0001;
  });

    // this.socketService.onEvent('convert-progress')
    // .subscribe((data) => {
    //   console.log(data, this.template.id);
    //   if (+data.animation_id === this.template.id) {
    //     this.progressBar = this.renderPercent + data.progress;
    //     console.log(this.progressBar);
    //   }
    //
    // });
  }

  deleteSlicePart() {
    this.editingStore.deleteProjectPart(this.position);
  }


  handleClickScreen(template: EditingState['activeAnimationStyle']): void {
    this.editingStore.setActiveStyle(template);
    console.log(this.position);
  }

  generateWidth = (duration): number => {
    // return (this.framesToSeconds(duration) * 32) * this.timelineStore.state.zoomValue;
    return (this.framesToSeconds(duration) * 16) * this.timelineStore.state.zoomValue;
  };

  changePosition(direction) {
    this.editingStore.changeTemplatesDirection(direction, this.position);
  }

  getOvenWidth = (pos): number => {
    let ovenWidth = 0;
    for (let i = 0; i <= pos; i++) {
    ovenWidth += this.generateWidth(this.duration);
  }
  console.log(ovenWidth);
  return ovenWidth;
  }

  framesToSeconds = (frames): number => {
    const FPS = 30;
    return frames / FPS;
  };

  checkAnimationLength() {
    return this.editingStore.state.project.animation.length > 1;
  }

  openDeletePopup() {
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(DeleteSlicePopupComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((res) => {
    if (res) {
      this.editingStore.deleteProjectPart(this.position);
    }
    });
  }

  ngOnDestroy() {
    this.ioConnection.unsubscribe();
  }

}
