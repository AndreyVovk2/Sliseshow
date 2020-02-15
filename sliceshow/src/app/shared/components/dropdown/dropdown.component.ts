import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {
  @Input() name: string;
  @Input() status: boolean;
  @Input() list: Array<string>;

  invisibility = false;

  constructor() {

  }

  ngOnInit() {
    if (typeof this.list === undefined || this.list.length === 0) {
      this.invisibility = true;
    }
    console.log(this.invisibility);
  }

}
