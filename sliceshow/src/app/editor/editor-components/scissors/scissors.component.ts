import {Component, OnInit, Input} from '@angular/core';
import {TimelineStore} from '../../timeline/timeline-store/timeline.store';

@Component({
  selector: 'app-scissors',
  templateUrl: './scissors.component.html',
  styleUrls: ['./scissors.component.scss']
})
export class ScissorsComponent implements OnInit {
  public timeCounter = 0;

  constructor(private timeline: TimelineStore) {
  }

  ngOnInit() {
    // this.timeCounter = 0;
  }

  divideTrack() {
    this.timeline.checkActiveTrackForCrop();
  }

  updateUpdate() {
    this.updatePosition(this.timeCounter + 211);
  }


  updatePosition(data) {
    console.log(data - 211);
    this.timeline.state.scissorsPosition = +data - 211;
    // this.timeline.state.scissorsPosition = +data;
    this.timeCounter = (+data - 211);
    // this.timeCounter = (+data);

  }

}
