import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-pop-up-error',
  templateUrl: 'pop-up-error.component.html',
  styleUrls: ['pop-up-error.component.scss']
})
export class PopUpErrorComponent {

  constructor(public dialogRef: MatDialogRef<PopUpErrorComponent>) { }

  onClose(): void {
    this.dialogRef.close();
  }

}
