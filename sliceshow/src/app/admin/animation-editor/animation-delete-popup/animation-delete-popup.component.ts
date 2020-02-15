import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';

@Component({
  selector: 'animation-delete-popup',
  templateUrl: './animation-delete-popup.component.html',
  styleUrls: ['./animation-delete-popup.component.scss']
})

export class AnimationDeletePopupComponent {
  constructor(public dialogRef: MatDialogRef<AnimationDeletePopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public matDialog: MatDialog) {

  }

  closeAndDelete() {
    this.dialogRef.close(true);
  }


}

