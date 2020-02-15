import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { AppStore } from '../../store/app.store';
// import { AppStore } from '../../shared/store/app.store';

@Component({
  selector: 'app-pop-up-one-slice',
  templateUrl: 'pop-up-one-slice.component.html',
  styleUrls: ['pop-up-one-slice.component.scss']
})
export class PopUpOneSliceComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<PopUpOneSliceComponent>, 
  public store: AppStore) { }

  ngOnInit() {
    console.log(this.store.state);
  }
  
  onAdd = new EventEmitter();

  onClose(mes): void {
    // const buffElem = this.store.state.bufferStyle;
    const buffElem = this.store.state.animationStyle;
    const tempSlices = this.store.state.selectSlice;
    const nextSlices = this.store.state.allTariffs.filter(v => v.id === tempSlices.id + 1);
    const basket = this.store.state.basket;

    console.log(mes);
    console.log(buffElem);

    if (mes === true && basket.length + 1 === nextSlices[0].slices) {
      this.store.saveSlice(nextSlices[0]);
      this.store.saveStyle(buffElem);
      // localStorage.setItem('selectTariff', JSON.stringify(nextSlices[0]));
    } else if (mes === true && basket.length + 1 !== nextSlices[0].slices) {
      this.store.saveStyle(buffElem);

    } else if (mes === false) {
      this.store.cleanStyleForPlay();
      // this.store.removeBuffer(); !!!!!!
    }

    this.store.countValues();
    this.dialogRef.close();
  }

  subscribeStateUpdates = (): void => {
    this.store.state$.subscribe(state => {
      console.log(state);
    });
  }

}
