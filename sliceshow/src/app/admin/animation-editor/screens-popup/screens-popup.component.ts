import { Component, OnInit, Inject, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'screens-popup',
  templateUrl: './screens-popup.component.html',
  styleUrls: ['./screens-popup.component.scss']
})
export class ScreensPopupComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<ScreensPopupComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.warn(this.data);
  }

}
