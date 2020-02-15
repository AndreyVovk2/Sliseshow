import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-tags-list',
  templateUrl: './tags-list.component.html',
  styleUrls: ['./tags-list.component.scss']
})
export class TagsListComponent implements OnInit {
  @Input() public tags: Array<any>;
  @Output() public tagSelected = new EventEmitter<any>();

  status: boolean;
  constructor() {
  }

  ngOnInit() {
  }

  handleSelectTag(tag): void {
    this.tagListToggle();
    this.tagSelected.emit(tag);
  }
  tagListToggle() {
    this.status = !this.status;
  }

  close(e) {
   if (!e) {
    this.status = false;
   }
  }
}
