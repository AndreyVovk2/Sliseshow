import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-library-preview-files',
  templateUrl: './library-preview-files.component.html',
  styleUrls: ['./library-preview-files.component.scss']
})


export class LibraryPreviewFilesComponent implements OnInit {

  public imageCheck = false;
  public videoCheck = false;

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<LibraryPreviewFilesComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {}


  ngOnInit () {
    console.log(this.data);
    this.checkDataType();

  }

  checkDataType() {
    if (this.data.type === 'image') {
      this.imageCheck = true;
    } else {
      this.videoCheck = true;
    }
  }

  closeModal() {
    this.dialogRef.close();
  }





}

