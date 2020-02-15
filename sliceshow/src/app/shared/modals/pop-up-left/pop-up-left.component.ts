import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-pop-up-left',
  templateUrl: './pop-up-left.component.html',
  styleUrls: ['./pop-up-left.component.scss']
})
export class PopUpLeftComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PopUpLeftComponent>) { }

    ngOnInit() {
      console.log(this.data);
    }

  onClose(value): void {
    this.dialogRef.close(value);
  }

}
