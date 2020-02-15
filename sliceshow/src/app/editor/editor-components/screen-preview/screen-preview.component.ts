import { Component, OnInit, Input } from '@angular/core';
import { EditingStore } from '../../store/editing.store';
// import { EditingStore} from '../../modules/editing-system/editing.store';

@Component({
  selector: 'app-screen-preview',
  templateUrl: './screen-preview.component.html',
  styleUrls: ['./screen-preview.component.scss']
})
export class ScreenPreviewComponent implements OnInit {
  @Input() count = '';
  @Input() image = '';
  @Input() checked = false;
  @Input() active = false;
  @Input() rendering = false;

  constructor(public editingStore: EditingStore) { }

  ngOnInit() {
  }

  subscribeStateUpdates = (): void => {
    this.editingStore.state$.subscribe(state => {
      console.log(state);
    });
  }

}
