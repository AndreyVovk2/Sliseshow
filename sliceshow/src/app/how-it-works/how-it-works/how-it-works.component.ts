import {Component, OnDestroy, OnInit} from '@angular/core';
import {HowItWorksService} from '../how-it-works.service';
import {Subscription} from 'rxjs/Subscription';
// import { AdminStore } from '../../components/adminChange/admin.store';
import { AdminService } from '../../shared/services/admin.service';
import { Meta } from '@angular/platform-browser';
import { AdminStore } from '../../admin/adminChange/admin.store';

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.scss']
})
export class HowItWorksComponent implements OnInit, OnDestroy {
  images = {
    img_head: '',
    img_body1: '',
    img_body2: '',
    img_body3: '',
    img_body4: '',
  };
  imagesOnInit: Subscription;
  constructor(
    private howItWorks: HowItWorksService, 
    private adminStore: AdminStore,
    private meta: Meta,
    private adminService: AdminService
  ) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.adminStore.savePageId(6);
    this.adminStore.changeMetaKey('HowItWorks.Meta');
    this.getMeta();
    

    this.imagesOnInit = this.howItWorks.getDataHowItWorks()
      .subscribe((data) => {
        console.log(data);
        this.images = data.basis.images;
      }, error => {
        console.log(error);
      });
  }

  ngOnDestroy() {

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

  subscribeStateUpdates = (): void => {
    this.adminStore.state$.subscribe(state => {
      console.log(state);
    });
  }

}
