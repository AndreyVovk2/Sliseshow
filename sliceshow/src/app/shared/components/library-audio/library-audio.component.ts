import {Component, Input, Output, OnInit, EventEmitter, OnDestroy} from '@angular/core';
import { AudioService } from '../../templates/audio.service';
import { LibraryState } from '../../../my-library/store/library-state';

@Component({
  selector: 'app-library-audio',
  templateUrl: './library-audio.component.html',
  styleUrls: ['./library-audio.component.scss']
})
export class LibraryAudioComponent extends AudioService implements OnInit, OnDestroy {
  @Input() trackData: LibraryState['song'];

  @Output() delete: EventEmitter<number> = new EventEmitter();

  constructor() {
    super();
  }

  ngOnInit() {
    console.log(this.trackData);
    this.load(this.trackData.file);
  }

  handleDelete = (id: number): void => {
    this.delete.emit(id);
  };

  ngOnDestroy() {
    this.audio.pause();
  }

}
