import {Component, OnInit, Input, ViewEncapsulation, ElementRef} from '@angular/core';
import {EditingStore} from '../../store/editing.store';
import {SocketService} from '../../socket-service';
// import { EditingStore } from '../../modules/editing-system/editing.store';
// import { SocketService } from '../../modules/editing-system/socket-service';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent implements OnInit {
  public link = '';
  isLoaded = false;
  private elem;

  // @Input() renderLink: boolean;

  constructor(public store: EditingStore,
              public el: ElementRef,
              private socketService: SocketService,
  ) {
  }

  ngOnInit() {
    this.subscribeStateUpdates();
  }

  onMetadata(event) {
    this.elem = this.el.nativeElement.querySelector('video');

    // this.changeCurrentTime$.subscribe(time => {
    //   event.target['currentTime'] = time;
    // });
  }

  subscribeStateUpdates = (): void => {
    this.store.state$.subscribe(state => {
    });
  };

  // getVideoLink = () => {
  //   this.isLoaded = true;
  //   if (this.store.state.activeTemplate.video_stream) {
  //     return this.store.state.activeTemplate.video_stream;
  //   } else if (this.store.state.activeTemplate.preview_video) {
  //     return this.store.state.activeTemplate.preview_video;
  //   } else {
  //     this.isLoaded = false;
  //     return '';
  //   }
  // }

  getVideoLink = () => {
    const date = +new Date().getTime();
    // console.log(date);
    const i = this.findIndex();

    this.isLoaded = true;
    if ('video_stream' in this.store.state.activeAnimationStyle) {
      return this.store.state.activeAnimationStyle.video_stream;
    } else if (this.store.state.project.animation[i].preview_video) {
      return this.store.state.project.animation[i].preview_video;
    } else {
      this.isLoaded = false;
      return '';
    }

  };

  findIndex() {
    const idx = this.store.state.project.animation
      .findIndex(x => x.id === this.store.state.activeAnimationStyle.id);
    return idx;
  }

}
