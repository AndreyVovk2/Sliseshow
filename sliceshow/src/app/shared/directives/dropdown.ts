import {Directive, HostBinding, HostListener} from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  @HostBinding('class.show') isOpen = false;

  // @HostListener('click') onClick() {
  //   this.isOpen = !this.isOpen;
  // }

  @HostListener('mouseleave') onLeave() {
    this.isOpen = false;
  }
}
