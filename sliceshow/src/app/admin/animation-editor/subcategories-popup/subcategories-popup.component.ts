import { Component, OnInit, Inject, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AnimationService } from '../animation.service';

@Component({
  selector: 'app-subcategories-popup',
  templateUrl: './subcategories-popup.component.html',
  styleUrls: ['./subcategories-popup.component.scss']
})
export class SubcategoriesPopupComponent implements OnInit {
  allSubCat = [];

  constructor( public dialogRef: MatDialogRef<SubcategoriesPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public animationService: AnimationService
    ) { }

  ngOnInit() {
    console.log(this.data);
    this.getSubCat();
  }

  getSubCat() {
    this.animationService.getSubCat()
    .subscribe(data => {
      console.log(data);
      this.allSubCat = data;
      this.checkCat();
      console.log(this.allSubCat);
    }, error => {
      console.log(error);
    });
  }


  checkCat() {
    if (this.data) {
      this.data.list.map(e => {
        const newCatList = this.allSubCat.map(v => {
          if (v.id === e.id) {
            v.checked = true;
          }
          return v;
        });
        console.log(newCatList);
      });
    }

  }

  saveSelectedCat() {
    this.data.list.length = 0;
    this.allSubCat.map(e => {
      if (e.checked) {
        this.data.list.push(e);
      }
    });
    // console.log(this.selectedCat);
    this.dialogRef.close();
  }

  


}
