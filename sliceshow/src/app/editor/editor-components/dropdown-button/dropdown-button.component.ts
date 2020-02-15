import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dropdown-button',
  templateUrl: './dropdown-button.component.html',
  styleUrls: ['./dropdown-button.component.scss']
})
export class DropdownButtonComponent {
  @Input() label: string;
  @Input() list: ''[];
  @Input() ml = '0px';

  @Output() itemClick: EventEmitter<null> = new EventEmitter();

  public isOpened = false;

  constructor() { }

  handleItemClick = (item): void => {
    this.itemClick.emit(item);
    this.isOpened = !this.isOpened;
  }

  toggleDropdown(event): void {
    if (event.target.classList.contains('dropdown-button') || event.target.classList.contains('label')) {
      this.isOpened = !this.isOpened;
    }
  }

}
