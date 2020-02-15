import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AnimationService } from '../animation.service';

@Component({
  selector: 'tags-popup',
  templateUrl: './tags-popup.component.html',
  styleUrls: ['./tags-popup.component.scss']
})
export class TagsPopupComponent implements OnInit {
  allSubCat = [];

  constructor( public dialogRef: MatDialogRef<TagsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public animationService: AnimationService
    ) { }

  ngOnInit() {
    this.getSubCat();
    console.log(this.data.list);
    console.log(this.data);
  }

  getSubCat() {
    this.animationService.getTags().subscribe(data => {
      this.allSubCat = data;
      console.log(this.allSubCat);
      this.checkCat();
    });

  }

  checkCat() {
    if (this.data.list) {
      this.data.list.map(e => {
        const newCatList = this.allSubCat.map(v => {
          if (v.id === e) {
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
      console.log(e);
      if (e.selected) {
        this.data.list.push(e.id);
      }
    });
    console.log(this.data.list);
    this.dialogRef.close();
  }
}
