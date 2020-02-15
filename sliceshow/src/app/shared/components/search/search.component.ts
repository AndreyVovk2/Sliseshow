import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Output() inputChange = new EventEmitter();
  @Input() searchValue: string;

  constructor() {
  }

  ngOnInit() {

  }


  valueChanged(val) {
    this.searchValue = val;
    this.inputChange.emit({
      search: val
    });
  }
}
