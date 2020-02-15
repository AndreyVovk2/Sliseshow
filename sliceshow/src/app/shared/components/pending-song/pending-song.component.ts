import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pending-song',
  templateUrl: './pending-song.component.html',
  styleUrls: ['./pending-song.component.scss']
})
export class PendingSongComponent {
  @Input() name = 'Untitled song';
  @Input() full = false;

  constructor() { }

}
