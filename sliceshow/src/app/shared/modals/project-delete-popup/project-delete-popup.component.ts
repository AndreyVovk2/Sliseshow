import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-project-delete-popup',
  templateUrl: './project-delete-popup.component.html',
  styleUrls: ['./project-delete-popup.component.scss']
})
export class ProjectDeletePopupComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ProjectDeletePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public matDialog: MatDialog ) { }


  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }

}
