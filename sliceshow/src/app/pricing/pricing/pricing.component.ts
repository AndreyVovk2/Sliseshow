import {Component, OnInit, OnDestroy} from '@angular/core';
import {PricingService} from '../pricing.service';
import {Subscription} from 'rxjs/Subscription';

import { AdminService } from '../../shared/services/admin.service';
import { Meta } from '@angular/platform-browser';
import { AdminStore } from '../../admin/adminChange/admin.store';
import { AppStore } from '../../shared/store/app.store';
import { Router } from '@angular/router';


@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit, OnDestroy {
  images = {
    img_head: ''
  };
  imagesOnInit: Subscription;
  allTariffs: Subscription;
  oneTariff: Subscription;
  selectTariffs = [];

  // allTariffs;

  constructor(
    private pricing: PricingService,
    private adminStore: AdminStore,
    private meta: Meta,
    private adminService: AdminService,
    private appStore: AppStore,
    private rt: Router

  ) {
  }

  ngOnInit() {
    this.getTarrifs();
    this.subscribeToUpdate();
  }

  subscribeToUpdate() {
    this.adminService.updateSliceEvent.subscribe( (result) => {
      console.log('UPDATE TARIFFS');
      this.getTarrifsAfterUpdate();
    });
  }

  getTarrifsAfterUpdate() {
    this.pricing.getTariffs()
      .subscribe((data) => {
        this.allTariffs = data;
        this.selectTariffs = [];
        this.selectTariffs.push(data[0]);
        this.selectTariffs.push(data[1]);
        this.selectTariffs.push(data[2]);
        console.log(this.selectTariffs);
        console.log('All tariffs:', data);
      });

    this.oneTariff = this.pricing.getOneTariff(1)
      .subscribe((data) => {
        console.log('Tariff id = 1', data);
      });
  }

  getTarrifs() {
    window.scrollTo(0, 0);
    this.adminStore.savePageId(8);
    this.adminStore.changeMetaKey('Pricing.Meta');
    this.getMeta();
    console.log(this.adminStore.state.currentLang);


    this.imagesOnInit = this.pricing.getStaticPricing()
      .subscribe((data) => {
        console.log(data);
        this.images = data.basis.images;
      });

    this.getTarrifsAfterUpdate();
  }

  goToStepTwo(slice) {
    this.appStore.saveSlice(slice);
    this.appStore.state.basketTotalPrice = this.appStore.state.selectSlice.price;
    this.rt.navigate(['/create-project/step-two']);

  }



  changePricing(slice) {
    if (this.selectTariffs[2].slices !== slice.slices) {
      this.selectTariffs.pop();
      this.selectTariffs.push(slice);
    }
  }

  subscribeStateUpdates = (): void => {
    this.adminStore.state$.subscribe(state => {
      console.log(state);
    });
  }

  getMeta() {
    this.removeDifMeta();
    this.meta.addTag({ name: 'viewport', content: 'width=device-width' });
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

  unSubscribeEvents() {
    this.adminService.updateSliceEvent.unsubscribe();
  }

  getVideoDuration(slice) {
    const videoMinDur = Math.round((slice.min_video_length / 60) * 10) / 10;
    const videoMaxDur = Math.round((slice.max_video_length / 60) * 10) / 10;
    const videoDuration = `${videoMinDur} - ${videoMaxDur} `;
    return videoDuration;
  }


  ngOnDestroy() {
    this.unSubscribeEvents();
    // this.imagesOnInit.unsubscribe();
    // this.allTariffs.unsubscribe();
    // this.oneTariff.unsubscribe();
  }


}
