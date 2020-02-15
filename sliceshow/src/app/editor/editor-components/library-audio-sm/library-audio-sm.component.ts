import {Component, Input, Output, OnInit, EventEmitter, OnDestroy} from '@angular/core';
import {AudioService} from '../../../shared/templates/audio.service';
import {TimelineState} from '../../timeline/timeline-store/timeline-state';
import {EditingStore} from '../../store/editing.store';

// import {TimelineStore} from '../../timeline/timeline-store/timeline.store';

@Component({
  selector: 'app-library-audio-sm',
  templateUrl: './library-audio-sm.component.html',
  styleUrls: ['./library-audio-sm.component.scss']
})
export class LibraryAudioSmComponent extends AudioService implements OnInit, OnDestroy {
  @Input() trackData: TimelineState['musicItem'];
  @Input() totalPause: '';

  @Output() use: EventEmitter<TimelineState['musicItem']> = new EventEmitter();

  public isUsed = false;
  private subscribe: any;

  constructor(public store: EditingStore) {
    super();
  }

  ngOnInit() {
    this.load(this.trackData.file);
  }

  subscribeToPause() {
  }

  newName() {
    const t = this.trackData.name.lastIndexOf('.');
    return this.trackData.name.slice(0, t);
  }

  toggleUse(trackData: TimelineState['musicItem']): void {
    console.log(trackData);
    this.use.emit(trackData);
    this.isUsed = !this.isUsed;
    this.store.saveProject(this.store.state.project);

  }

  ngOnDestroy() {
    this.audio.pause();
  }

}
