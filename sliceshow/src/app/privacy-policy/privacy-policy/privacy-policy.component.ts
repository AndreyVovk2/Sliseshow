import {Component, OnDestroy, OnInit} from '@angular/core';
import {PrivacyPolicyService} from '../privacy-policy.service';
import {Subscription} from 'rxjs/Subscription';
// import { AdminStore } from '../../components/adminChange/admin.store';
import { AdminService } from '../../shared/services/admin.service';
import { Meta } from '@angular/platform-browser';
import { AdminStore } from '../../admin/adminChange/admin.store';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: 'privacy-policy.component.html',
  styleUrls: ['privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit, OnDestroy {
  images = {
    img_head: '',
    img_body1: ''
  };
  imagesOnInit: Subscription;

  constructor(
    private privacyPolicy: PrivacyPolicyService, 
    private adminStore: AdminStore,
    private meta: Meta,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.adminStore.savePageId(9);
    this.adminStore.changeMetaKey('PrivacyPolicy.Meta');
    this.getMeta();


    this.imagesOnInit = this.privacyPolicy.getDataPrivacyPolicy()
      .subscribe((data) => {
        console.log(data);
        this.images = data.basis.images;
      });
  }

  ngOnDestroy() {
    this.imagesOnInit.unsubscribe();
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
