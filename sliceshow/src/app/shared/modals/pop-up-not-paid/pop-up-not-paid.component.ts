import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'pop-up-not-paid',
  templateUrl: './pop-up-not-paid.component.html',
  styleUrls: ['./pop-up-not-paid.component.scss']
})
export class PopUpNotPaidComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PopUpNotPaidComponent>) {
  }

  ngOnInit() {
  }

  Add(succes: boolean): void {
    this.dialogRef.close(succes);
    console.log(succes);
  }
}





