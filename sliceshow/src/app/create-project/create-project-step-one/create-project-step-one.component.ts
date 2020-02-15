import {Component, OnInit} from '@angular/core';
import {PricingService} from '../../pricing/pricing.service';
import {AppStore} from '../../shared/store/app.store';
import {ActivatedRoute, Router} from '@angular/router';
import {HostListener, Inject} from '@angular/core';

// import { AdminStore } from '../../components/adminChange/admin.store';
import {AdminService} from '../../shared/services/admin.service';
import {Meta} from '@angular/platform-browser';
import {AdminStore} from '../../admin/adminChange/admin.store';
import {PopUpShopingCartComponent} from '../../shared/modals/pop-up-shoping-cart/pop-up-shoping-cart/pop-up-shoping-cart.component';
import {MatDialog} from '@angular/material';
import {el} from '@angular/platform-browser/testing/src/browser_util';

@Component({
  selector: 'app-create-project-step-one',
  templateUrl: './create-project-step-one.component.html',
  styleUrls: ['./create-project-step-one.component.scss']
})
export class CreateProjectStepOneComponent implements OnInit {
  modall: any;
  button: any;
  showTariff = [];
  public showTariffs = [];
  private user = {};
  public selectedTariff;
  public fixed: boolean;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    const number = window.scrollY;
    if (number >= 300) {
      this.fixed = true;
    } else {
      this.fixed = false;
    }
  }


  constructor(
    public pricing: PricingService,
    public store: AppStore,
    private rt: Router,
    private adminStore: AdminStore,
    private meta: Meta,
    private adminService: AdminService,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.adminStore.changeMetaKey('StepOne.Meta');
    this.getMeta();
    this.startFunc();
    console.log(this.store.state.basket);
    this.store.cleanBasket();
    // this.store.state.basket = [];
    // console.log(this.storae.state.basket);
  }

  startFunc() {
    this.store.state.allTariffs.length === 0 ? this.getAllTariffs() : this.checkSelectTariff();
  }

  async getAllTariffs() {
    const uId = this.user['tariff_id'];
    const data = await this.pricing.getTariffs().toPromise();
    // console.log(data);
    this.store.saveAllTariffs(data);
    // console.log(this.store.state.allTariffs);
    this.store.state.allTariffs.forEach(i => {
      if (i.id === uId) {
        this.store.saveSlice(i);
      }
    });
    this.checkSelectTariff();
  }

  checkSelectTariff() {
    const tariffId = this.user['tariff_id'];
    if (tariffId && this.store.state.selectSlice) {
      this.toogleSelect(tariffId);
      this.getSelectTariff();
    } else if (!this.store.state.selectSlice) {
      this.getDefaultTariff(3);
    }

    console.log(this.store.state);

  }

  getDefaultTariff(num) {
    this.store.state.allTariffs.map((v, index) => {
      if (num > index) {
        this.showTariffs.push(v);
      }
    });
  }

  getSelectTariff() {
    if (this.store.state.selectSlice.id <= 3) {
      this.getDefaultTariff(3);
    } else if (this.store.state.selectSlice.id > 3) {
      this.getDefaultTariff(2);
      this.store.state.allTariffs.map(v => {
        if (v.id === this.store.state.selectSlice.id) {
          this.showTariffs.push(v);
        }
      });
    }
  }

  nextTariff(id: any) {
    if (id === this.store.state.allTariffs.length) {
      return;
    }
    this.showTariffs.pop();
    this.showTariffs.push(this.store.state.allTariffs[id]); // change func parametr from id to obj with tariff
  }

  prevTariff(id: any) {
    if (id === 3) {
      return;
    }
    this.showTariffs.pop();
    this.showTariffs.push(this.store.state.allTariffs[id - 2]);
  }

  toogleSelect(id: number) {
    this.store.state.allTariffs.map(m => {
      if (m.id === id) {
        this.store.saveSlice(m);
      }
    });
  }

  continue() {
    if (this.store.state.selectSlice) {
      this.user['tariff_id'] = this.store.state.selectSlice.id;
      this.store.state.basketTotalPrice = this.store.state.selectSlice.price;
      localStorage.setItem('currentUser', JSON.stringify(this.user));
      this.rt.navigate(['/create-project/step-two']);
    }
  }

  getMeta() {
    this.removeDifMeta();
    this.meta.addTag({name: 'viewport', content: 'width=device-width'});
    this.adminService.getMetaTranslate(this.adminStore.state.metaKey, this.adminStore.state.currentLang)
      .subscribe((data) => {
        // this.meta.removeTag('name');
        this.meta.addTags(data);
      });
  }

  removeDifMeta() {
    const metas = this.meta.getTags('name');
    metas.forEach(elem => {
      this.meta.removeTag('name= ' + elem.name);
    });
  }

  subscribeStateUpdates = (): void => {
    this.store.state$.subscribe(state => {
      console.log(state);
    });
  };

  modal(id: number) {
    if (this.store.state.selectSlice.id > id) {
      this.openModal(id);
    } else {
      this.toogleSelect(id);
    }

    console.log(`project id: ${id}`);
  }

  openModal(id: number) {
    const dialogRef = this.dialog.open(PopUpShopingCartComponent, {});
    console.log(`id result: ${id}`);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`); // Pizza!
      if (result) {
        this.toogleSelect(id);
      }
    });

  }
}
