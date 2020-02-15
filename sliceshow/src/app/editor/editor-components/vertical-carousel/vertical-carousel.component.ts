import { Component, OnInit, Input } from '@angular/core';
import { TimelineStore } from '../../timeline/timeline-store/timeline.store';
import { EditingStore } from '../../store/editing.store';
import { EditingState } from '../../store/editing-state';
// import { EditingStore} from '../../modules/editing-system/editing.store';
// import { nodeUrl } from '../../shared/services/common.url';
// import { EditingState } from '../../modules/editing-system/editing-state';
// import { TimelineStore} from '../timeline/timeline.store';

@Component({
  selector: 'app-vertical-carousel',
  templateUrl: './vertical-carousel.component.html',
  styleUrls: ['./vertical-carousel.component.scss']
})
export class VerticalCarouselComponent implements OnInit {
  // public nodeUrl = nodeUrl;
  public nodeUrl;
  public rotate = false;

  constructor(public editingStore: EditingStore, public timelineStore: TimelineStore) {
    
   }

  ngOnInit() {
    this.nodeUrl = this.editingStore.state.nodeDomain;
  }
  
  handleScrollDown = () => {
    const SCROLL_TIME = 800;
    const carouserEl = document.getElementById('carousel');
    const carouselContainerEl = document.getElementById('carousel-container');
    if ((carouselContainerEl.clientHeight - carouserEl.scrollTop) <= 535) {
      this.rotate = false;
      this.scrollTo(carouserEl, 0, SCROLL_TIME);
    } else {
      this.rotate = true;
      this.scrollTo(carouserEl, carouserEl.scrollTop + 535, SCROLL_TIME);
    }
  }

  returnCounter(count) {
    return +count <= 8 ? `0${count + 1}` : count + 1;
  }

    
  scrollTo(element, to, duration) {
    const start = element.scrollTop;
    const change = to - start;
    let currentTime = 0;
    const increment = 20;

    const animateScroll = () => {
      currentTime += increment;
      const val = this.easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };

    animateScroll();
  }

  easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) {
      return c / 2 * t * t + b;
    }
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  selectTemplate(template: EditingState['activeTemplate']) {
      this.editingStore.setActiveTemplate(template);
      // console.log(template);
      const video = <HTMLVideoElement>document.getElementById('video_load');
      video.currentTime = template.time_code;
      // console.log(video);



  }

  subscribeStateUpdates = (): void => {
    this.editingStore.state$.subscribe(state => {
      console.log(state);
    });
  }

}
