import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EditingStore } from '../../store/editing.store';
// import { nodeUrl } from '../../shared/services/common.url';
// import { EditingStore} from '../../modules/editing-system/editing.store';

@Component({
  selector: 'app-media-button',
  templateUrl: './media-button.component.html',
  styleUrls: ['./media-button.component.scss']
})
export class MediaButtonComponent implements OnInit {
  // public nodeUrl = nodeUrl;
  public nodeUrl;

  @Input() isPhoto = false;
  @Input() isVideo = false;
  // @Input() isText = false;
  @Input() isUploaded = false;
  @Input() image = '';
  @Output() getData = new EventEmitter<number>();
  // @Input() func1 = '';
  // @Input() func2 = '';

  constructor(public editingStore: EditingStore) { }

  ngOnInit() {
    this.nodeUrl = this.editingStore.state.nodeDomain;
  }
 
  buttState(num) {
    console.log(num);
    this.getData.emit(num);
      this.editingStore._isAnimationStyleCompleted(this.editingStore.state);
  }

  mediaButtonsValid () {
    if (this.editingStore.state.project) {
      return this.editingStore.state.activeAnimationStyle.is_rendering
        || this.editingStore.state.project.mergeStatus
        || this.editingStore.state.project.renderAndMerge;
    } else {
      return true;
    }

  }


}
