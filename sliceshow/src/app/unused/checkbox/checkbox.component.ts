import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent {
  @Input() label: any;
  @Input() warn = false;
  @Input() visiabl = false;

  constructor() { }

  check() {
    console.log('dfd');
    return this.visiabl = !this.visiabl;
  }
}
