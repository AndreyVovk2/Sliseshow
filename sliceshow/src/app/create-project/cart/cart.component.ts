import {Component, OnInit, Input} from '@angular/core';
import {GalleryService} from '../../shared/services/gallery.service';
import {AppStore} from '../../shared/store/app.store';
import {PricingService} from '../../pricing/pricing.service';
import {MatDialog} from '@angular/material';
import {PopUpOneSliceComponent} from '../../shared/modals/pop-up-one-slice/pop-up-one-slice.component';
import {PopUpLeftComponent} from '../../shared/modals/pop-up-left/pop-up-left.component';
import {PopUpProjectNameComponent} from '../../shared/modals/pop-up-project-name/pop-up-project-name.component';
import {ProjectService} from '../../shared/services/project.service';
import {PopUpNotPaidComponent} from '../../shared/modals/pop-up-not-paid/pop-up-not-paid.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  @Input() cards: any[];
  @Input() fixed: boolean;
  public toggleBasket = false;
  public currentBasket;
  paids: any = [];
  notPaid: number;
  constructor(
    public dialog: MatDialog,
    private gallery: GalleryService,
    public store: AppStore,
    public pricing: PricingService,
    public project: ProjectService,

  ) {
  }

  ngOnInit() {

    // console.log(this.store.state.allTariffs[0].price);
  }
  removeStyle(card) {
    this.store.removeStyle(card.id);
  }

  showHideModal(event) {
    if (event.path !== undefined) {
      const path = event.path[1].classList[0];
      if (path === 'basketButton') {
        this.toggleBasket = true;
      } else if (path === 'closePop') {
        this.toggleBasket = false;
      }
    } else if (event.path === undefined) {
      const path1 = event.target.className || event.target.parentNode.className;
      if (path1 === 'basketButton') {
        this.toggleBasket = true;
      } else if (path1 === 'closePop') {
        this.toggleBasket = false;
      }
    }
  }

  openDialogOneSlice() { // show when user must upgrade tariff
    const ref = this.dialog.open(PopUpOneSliceComponent);
    const sub = ref.componentInstance.onAdd.subscribe((data) => {
      return data;
    });
  }

  openDialogLeft() { // show when user have unused slice
    this.dialog.open(PopUpLeftComponent);
  }

  openDialogProjectName() { // name your project after continue
    if (this.store.state.basket.length !== 0) {
      this.dialog.open(PopUpProjectNameComponent);
    }
  }

  subscribeStateUpdates = (): void => {
    this.store.state$.subscribe(state => {
      console.log(state);
    });
  };

  showAll() {
    this.store.countValues();
    // this.currentBasket = this.store.state.basket;
    // console.log(this.store.state.allTariffs);
    // console.log(this.store.state.basket);
    // console.log(this.store.state.selectSlice);
    // this.checkPictures();
  }

  // checkPictures() {
  //   const test = JSON.stringify(this.store.state.basket);
  //   this.currentBasket = JSON.parse(test);
  //   console.log(this.currentBasket);
  //   this.currentBasket.forEach(selectAnimation  => {
  //     selectAnimation.templates.forEach(template => {
  //       if (selectAnimation.select_template_id === template.id) {
  //         console.log (template);
  //       }
  //     });
  //   });
  // }
  errorPaid() {
    const prom = new Promise(() => {
      const dialogRef = this.dialog.open(PopUpNotPaidComponent);
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
      });

    });
  }
  noPaid() {

    this.project.getPaid().subscribe(res => {
      console.log(res);
      this.paids = res;
      this.notPaid = res.count;
      if (this.notPaid > 2) {
        this.errorPaid();
      } else {
        this.openDialogProjectName();
      }
    });
  }
}
