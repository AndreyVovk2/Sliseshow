import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-wrong-file-format',
  templateUrl: './wrong-file-format.component.html',
  styleUrls: ['./wrong-file-format.component.scss']
})
export class WrongFileFormatComponent {

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<WrongFileFormatComponent>) { }


}
