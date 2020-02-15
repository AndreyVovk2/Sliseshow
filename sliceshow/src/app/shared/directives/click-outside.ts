import {Directive, ElementRef, Output, EventEmitter, HostListener} from '@angular/core';

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {
  @Output()
  public clickOutside = new EventEmitter<any>();

  constructor(private _elementRef: ElementRef) {
  }

  @HostListener('document:click', ['$event'])
  public onClick(event) {
    const isClickedInside = this._elementRef.nativeElement.contains(event.target);
    if (!isClickedInside) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.clickOutside.emit(isClickedInside);
  }
}
