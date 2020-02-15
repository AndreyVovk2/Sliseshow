import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AnimationService } from '../animation.service';

@Component({
  selector: 'styles-popup',
  templateUrl: './styles-popup.component.html',
  styleUrls: ['./styles-popup.component.scss']
})
export class StylesPopupComponent implements OnInit {
  allSubCat = [];

  constructor( public dialogRef: MatDialogRef<StylesPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public animationService: AnimationService
    ) { }

  ngOnInit() {
    this.getSubCat();
    console.log(this.data.list);
  }

  getSubCat() {
    this.animationService.getAllAnimationStyles()
    .subscribe(data => {
      this.allSubCat = data;
      this.checkCat();
      console.log(this.allSubCat);
    }, error => {
      console.log(error);
    });
  }

  checkCat() {
    if (this.data.list) {
      this.data.list.map(e => {
        const newCatList = this.allSubCat.map(v => {
          if (v.id === e.id) {
            v.selected = true;
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
      if (e.selected) {
        this.data.list.push(e);
      }
    });
    console.log(this.data.list);
    this.dialogRef.close();
  }

}
