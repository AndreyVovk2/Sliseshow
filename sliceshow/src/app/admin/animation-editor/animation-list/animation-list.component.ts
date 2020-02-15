import {Component, Injectable, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AnimationService } from '../animation.service';
import {ScreensPopupComponent} from '../screens-popup/screens-popup.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { AnimationDeletePopupComponent } from '../animation-delete-popup/animation-delete-popup.component';



@Injectable ()
@Component({
  selector: 'animation-list',
  templateUrl: './animation-list.component.html',
  styleUrls: ['./animation-list.component.scss']
})
export class AnimationListComponent implements OnInit {
  allAnimations = [];

  constructor(
    private animationService: AnimationService,
    private rt: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getAllStyles();
  }

  // openScreensModal() {
  //   const dialogRef = this.dialog.open(ScreensPopupComponent, {
  //     data: {number: 5},
  //   });
  // }

  getAllStyles() {
    this.animationService.getAllAnimationStyles()
    .subscribe(data => {
      console.log(data);
      this.allAnimations = data;
    }, error => {
      console.log(error);
    });
  }

  generalSettings(style) {
    this.rt.navigate([`${style.id}/settings`], {relativeTo: this.route});
      console.log(style);
  }

  changeStyle(style) {
    this.rt.navigate([`${style.id}`], {relativeTo: this.route});
  }

   createNewStyle() {
    this.rt.navigate(['new'], {relativeTo: this.route,  queryParams: { creating: 'newStyle' }} );
  }

  changeScreens(style) {
    this.rt.navigate([`${style.id}/screens`], {relativeTo: this.route} );
  }

  deleteStyle(style, event) {
      event.stopPropagation();
      this.animationService.removeStyle(style.id)
      .subscribe(data => {
        console.log(data);
        this.getAllStyles();
      }, error => {
        console.log(error);
      });
    }

    openDeletePopup(style, event) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = ['modal-padding'];
      const dialogRef = this.dialog.open(AnimationDeletePopupComponent, dialogConfig);


      dialogRef.afterClosed().subscribe(
        (data) => {
         console.log(data);
         if (data === true) {
           this.deleteStyle(style, event);
         }
        });
    }


}
