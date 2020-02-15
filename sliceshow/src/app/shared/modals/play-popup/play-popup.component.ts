import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

import { Router} from '@angular/router';
import { PopUpOneSliceComponent } from '../pop-up-one-slice/pop-up-one-slice.component';
import { AppStore } from '../../store/app.store';
import { ViewChild } from '@angular/core';
import { ElementRef, Renderer2 } from '@angular/core';


@Component({
  selector: 'app-play-popup',
  templateUrl: './play-popup.component.html',
  styleUrls: ['./play-popup.component.scss']
})
export class PlayPopupComponent implements OnInit {

  @ViewChild('videoTag') videoTag: ElementRef;
  public video_src: string;

  constructor(public dialogRef: MatDialogRef<PlayPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public store: AppStore,
    private rt: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.findVideoLink();
  }

  closeModal() {
    this.dialogRef.close();
  }

  changedSelectId(template) {
    console.log(template);
    const chosenPic = {
      ...this.data.wholeData,
      select_duration: +template.duration,
      select_pic: +template.pics,
      select_template_id: +template.id,
      types: template.types
    };
     console.log(chosenPic);
   this.store.changeAnimationStyleState(true);
    this.store.saveStyleForPlay(chosenPic);
    this.data.select_template_id = template.id;
    this.findVideoLink();
    this.videoTag.nativeElement.load();


    // this.store.changeAnimationStyleState(true);
    // this.store.saveStyleForPlay(data);
  }

  findVideoLink() {
      this.store.state.animationStyle.templates.map(template => {
        if (template.id === this.data.select_template_id) {
          this.video_src = template.preview_video;
          return template.preview_video;
        }
      });

  }

  startCreating() {
    this.closeModal();
    if (this.store.state.selectSlice) {
      this.rt.navigate(['/create-project/step-three']);
    } else {
      this.rt.navigate(['/create-project/step-one']);
    }
  }

  add() {
    this.closeModal();
    const tariff = this.store.state.selectSlice.slices;
    const basketLength = this.store.state.basket.length;


    if ( basketLength >= tariff) {
      const modal = this.openDialogOneSlice();
      return;
    }
    this.store.saveStyle(this.store.state.animationStyle);
    // console.log(this.store.state.basket);
    this.store.countValues();
  }

  subscribeStateUpdates = (): void => {
    this.store.state$.subscribe(state => {
      console.log(state);
    });
  }

  openDialogOneSlice() { // show when user must upgrade tariff
    const ref = this.dialog.open(PopUpOneSliceComponent);
    const sub = ref.componentInstance.onAdd.subscribe((data) => {
      console.log(data);
      return data;
    });
}

}
