import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-load-progress',
  templateUrl: './load-progress.component.html',
  styleUrls: ['./load-progress.component.scss']
})
export class LoadProgressComponent implements OnInit {

  constructor() { }
  @Input() progress: number;

  ngOnInit() {
  }

}
