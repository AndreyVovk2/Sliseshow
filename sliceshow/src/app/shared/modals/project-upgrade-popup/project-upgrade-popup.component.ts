import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-project-upgrade-popup',
  templateUrl: './project-upgrade-popup.component.html',
  styleUrls: ['./project-upgrade-popup.component.scss']
})
export class ProjectUpgradePopupComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ProjectUpgradePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public matDialog: MatDialog ) { }

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
