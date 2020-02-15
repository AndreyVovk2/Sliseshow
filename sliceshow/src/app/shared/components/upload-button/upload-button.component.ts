import { Component, Input } from '@angular/core';
import { LibraryStore } from '../../../my-library/store/library.store';
// import { LibraryStore } from '../../my-library/store/library.store';


@Component({
  selector: 'app-upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss']
})
export class UploadButtonComponent {
  constructor(private store: LibraryStore) { }

  @Input() accept = this.store.state.acceptFile;

  subscribeStateUpdates = (): void => {
    this.store.state$.subscribe(state => {
      console.log(state);
    });
  }
}
