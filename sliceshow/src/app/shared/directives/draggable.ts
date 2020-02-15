
import {fromEvent as observableFromEvent} from 'rxjs/observable/fromEvent';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import {map, switchMap, takeUntil} from 'rxjs/operators';
import {AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy, Output, EventEmitter} from '@angular/core';
import { TimelineStore } from '../../editor/timeline/timeline-store/timeline.store';


@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective implements AfterViewInit, OnDestroy {


  @Input() dragHandle: string;
  @Input() dragTarget: string;
  @Output() getData: EventEmitter<any> = new EventEmitter();

  // Element to be dragged
  private target: HTMLElement;
  // Drag handle
  private handle: HTMLElement;
  private line: HTMLElement;
  private parentScroll: HTMLElement;
  private startX: number;
  private delta = {x: 0};
  private offset = {x: 0};
  private position: number;

  innerPosition: number;

  private destroy$ = new Subject<void>();

  constructor(private elementRef: ElementRef, private zone: NgZone, private store: TimelineStore) {
  }

  public ngAfterViewInit(): void {

    this.handle = this.dragHandle ? document.querySelector(this.dragHandle) as HTMLElement :
      this.elementRef.nativeElement;
    this.target = document.querySelector(this.dragTarget) as HTMLElement;
    this.line = document.querySelector('.emptyTopLine') as HTMLElement;
    this.parentScroll = document.getElementById('content') as HTMLElement;

    this.setupEvents();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
  }

  private setupEvents() {
    this.zone.runOutsideAngular(() => {
      const mousedown$ = observableFromEvent(this.handle, 'mousedown');
      // const mouseclick$ = Observable.fromEvent(this.handle, 'click');
      const mousemove$ = observableFromEvent(document, 'mousemove');
      const mouseup$ = observableFromEvent(document, 'mouseup');


      const mousedrag$ = mousedown$.pipe(switchMap((event: MouseEvent) => {
        this.startX = event.clientX - event.offsetX + 40;
        // const lineStart = this.getLinePos();


        return mousemove$.pipe(
          map((e: MouseEvent) => {
            this.store.setScissorsPosition(this.getLinePos());
            e.preventDefault();
            this.delta.x = e.clientX - this.startX;
            if (window.innerWidth - this.target.offsetLeft < 100) {
              this.parentScroll.scrollBy(200, 0);
            } else if (this.target.offsetLeft < 400 && this.parentScroll.scrollLeft > 0) {
              this.parentScroll.scrollBy(-200, 0);
            }
          }),


          takeUntil(mouseup$), );
      }), takeUntil(this.destroy$), );

      mousedrag$.subscribe(() => {
        if (this.delta.x === 0) {
          return;
        }

        if (this.getLinePos() <= 250 && this.delta.x <= 0 && this.parentScroll.scrollLeft === 0) {
          this.delta.x = 0;
          this.offset.x = 0;
          this.startX = 251;
          return;
        }

        if (this.getLinePos() >= (this.store.state.timeineWidth - this.parentScroll.scrollLeft + 211 + 40) && this.delta.x >= 0) {
          this.delta.x = 0;
          this.offset.x = this.store.state.timeineWidth - this.parentScroll.scrollLeft;
          this.startX = this.store.state.timeineWidth - this.parentScroll.scrollLeft + 250;
          return;
        }


        this.translate();
      });

      mouseup$.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.offset.x += this.delta.x;
        this.delta.x = 0;
      });
    });
  }

  getLinePos() {
    return this.line.getBoundingClientRect().left + 39;
  }

  private translate() {
    requestAnimationFrame(() => {
      if (this.offset.x + this.delta.x + 211 < 211 && this.parentScroll.scrollLeft === 0) {
        this.position = 211;
        this.target.style.left = `${this.position}px`;
      } else if (this.getLinePos() >= this.store.state.timeineWidth - this.parentScroll.scrollLeft + 211 + 40 && this.delta.x >= 0) {
        this.position = this.store.state.timeineWidth - this.parentScroll.scrollLeft + 211 - 40;
        this.target.style.left = this.position >= 211 ? `${this.position}px` : `${211}px`;
      } else {
        this.position = 211 + this.offset.x + this.delta.x;
        this.target.style.left = this.position >= 211 ? `${this.position}px` : `${211}px`;
      }
      if (this.position >= 211) {
        this.getData.emit(this.position + this.parentScroll.scrollLeft);
      }
    });
  }
}
