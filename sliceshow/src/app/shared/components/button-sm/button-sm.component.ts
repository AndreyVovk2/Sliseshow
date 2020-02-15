import { Component, Input } from '@angular/core';
import { ButtonService } from '../../templates/button.service';

@Component({
  selector: 'app-button-sm',
  templateUrl: './button-sm.component.html',
  styleUrls: ['./button-sm.component.scss']
})
export class ButtonSmComponent extends ButtonService {
  @Input() width = 'auto';
  @Input() mr = '0';

  constructor() {
    super();
   }

}
