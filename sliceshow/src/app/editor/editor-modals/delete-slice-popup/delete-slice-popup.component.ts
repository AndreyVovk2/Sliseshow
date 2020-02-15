import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


@Component({
  selector: 'app-delete-slice-popup',
  templateUrl: 'delete-slice-popup.component.html',
  styleUrls: ['delete-slice-popup.component.scss']
})

export class DeleteSlicePopupComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<DeleteSlicePopupComponent>) {

  }

  ngOnInit() {
    console.log('delete-slice-popup.component');
  }


  closePopup (value) {
    this.dialogRef.close(value);
  }



}

