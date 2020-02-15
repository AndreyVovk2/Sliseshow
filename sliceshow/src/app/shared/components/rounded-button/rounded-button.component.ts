import {Component, Input} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ModalErrorRenderComponent} from '../../modals/modal-error-render/modal-error-render.component';


@Component({
  selector: 'app-rounded-button',
  templateUrl: './rounded-button.component.html',
  styleUrls: ['./rounded-button.component.scss']
})

export class RoundedButtonComponent {
  constructor(public dialog: MatDialog) {

  }

  @Input() label = '';
  @Input() primary = false;
  @Input() disabled = false;
  @Input() secondary = false;
  @Input() default = false;
  @Input() neutral = false;
  @Input() mr = false;

  addModal(event) {
    console.log(event);
    if (this.disabled === true) {
      this.dialog.open(ModalErrorRenderComponent);
    }
  }
}
