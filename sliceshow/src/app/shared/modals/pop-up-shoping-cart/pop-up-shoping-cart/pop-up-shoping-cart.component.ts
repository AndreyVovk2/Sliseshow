import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {AppStore} from '../../../store/app.store';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Component({
  selector: 'pop-up-shoping-cart',
  templateUrl: './pop-up-shoping-cart.component.html',
  styleUrls: ['./pop-up-shoping-cart.component.scss']
})
export class PopUpShopingCartComponent implements OnInit {
  projects: any = [];
  constructor(
    public store: AppStore,
    public dialogRef: MatDialogRef<PopUpShopingCartComponent>
  ) {
  }

  ngOnInit() {

  }

  closeModal(closedSucceed: boolean) {
    this.dialogRef.close(closedSucceed);
  }

  toogleSelect(id: number) {
    this.store.state.allTariffs.map(m => {
      if (m.id === id) {
        this.store.saveSlice(m);
      }
    });
  }
}
