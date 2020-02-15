import { Component, ViewChild, ElementRef, OnInit, Renderer2, Input, HostListener, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.scss']
})
export class RangeSliderComponent implements OnInit {

  @Input() startPoint: any;
  @Input() length: any;
  @Input() range: any;
  @Output() getData = new EventEmitter<any>();

  minWidthSlider: number;

  slideMark = {
    width: 20,
    height: 20,
    firstMarkPosition: 0,
    secondMarkPosition: 0,
    draggbleState: false,
    cursorPosition: 0,
    halfWidth: 0
  };

  track = {
    size: 800,
    startPos: 0,
    selectTrack: 0,
    resizeK: 0,
    resizeT: 0
  };

  cutTrack = {
    startTime: 0,
    endTime: 0
  };



  @HostListener('window:mouseup', ['$event'])
    mouseUp(event) {
      event.stopPropagation();
      event.preventDefault();
      this.slideMark.draggbleState = false;
      this.showing();
      this.getData.emit(this.cutTrack);
    }

    @HostListener('window:mousemove', ['$event'])
    mouseMove(e) {
    // console.log('AAAAAAAA');
      if (this.slideMark.draggbleState) {
      if (e.clientX >= (this.slideMark.cursorPosition + this.slideMark.halfWidth)
          && e.clientX <= this.slideMark.cursorPosition + this.track.size - this.track.selectTrack) {

        this.slideMark.firstMarkPosition = (e.clientX - this.slideMark.cursorPosition);
        // this.slideMark.secondMarkPosition = this.slideMark.firstMarkPosition + (this.range * this.track.resizeK);
        this.slideMark.secondMarkPosition = this.countSecondMarkPos();
        this.track.startPos = this.slideMark.firstMarkPosition - this.slideMark.halfWidth;

      }
      }
    }

  constructor(private renderer: Renderer2
  ) { }

  ngOnInit() {

    this.track.resizeK = this.track.size / this.length;
    // this.track.resizeK = this.track.size / this.length;
    this.slideMark.halfWidth = - this.slideMark.width / 2;
    this.slideMark.firstMarkPosition = this.slideMark.halfWidth;
    // this.slideMark.firstMarkPosition = 5;
    // this.slideMark.secondMarkPosition = this.slideMark.firstMarkPosition + (this.range * this.track.resizeK);
    this.slideMark.secondMarkPosition = this.countSecondMarkPos();
    this.track.startPos = this.slideMark.firstMarkPosition - this.slideMark.halfWidth;
    this.track.selectTrack = (this.range * this.track.resizeK) - this.slideMark.halfWidth;

}

countSecondMarkPos() {
    // return this.slideMark.firstMarkPosition + (this.range * this.track.resizeK);
    return this.slideMark.firstMarkPosition + this.selectTrackWidth();
}

selectTrackWidth() {
    // return this.range * this.track.resizeK;
  const minWidthTrack = 50;
  const widthTrack = this.range * this.track.resizeK;
  if (widthTrack < minWidthTrack) {
    this.track.selectTrack = minWidthTrack - this.slideMark.halfWidth;
    this.track.resizeT = this.length / (this.track.size - (minWidthTrack - widthTrack) );
    return minWidthTrack;
  } else {
    return widthTrack;
  }
  // return widthTrack < minWidthTrack ? minWidthTrack : widthTrack;
}

changePos1(e) {
  this.slideMark.draggbleState = true;
  if (!this.slideMark.cursorPosition) {
    this.slideMark.cursorPosition = e.clientX;
  }
}

showing() {
  // this.cutTrack.startTime = (this.slideMark.firstMarkPosition - this.slideMark.halfWidth) his.track.resizeK;
  // this.cutTrack.endTime = (this.slideMark.secondMarkPosition - this.slideMark.halfWidth) * this.length / this.track.size;
  if (this.track.resizeT === 0) {
    this.cutTrack.startTime = (this.slideMark.firstMarkPosition - this.slideMark.halfWidth) * this.length / this.track.size;
  } else {
    this.cutTrack.startTime = (this.slideMark.firstMarkPosition - this.slideMark.halfWidth) * this.track.resizeT;
  }
  this.cutTrack.endTime = this.cutTrack.startTime + this.range;

}

startTime () {
  // if (this.track.resizeT === 0) {
  //   this.cutTrack.startTime = (this.slideMark.firstMarkPosition - this.slideMark.halfWidth) * this.length / this.track.size;
  // } else {
  //   this.cutTrack.startTime = (this.slideMark.firstMarkPosition - this.slideMark.halfWidth) * this.track.resizeT;
  // }
    this.showing();
    return this.cutTrack.startTime;
}

endTime () {
    return this.cutTrack.endTime = this.startTime () + this.range;
}

}
