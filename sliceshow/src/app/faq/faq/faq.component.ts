import {Component, OnDestroy, OnInit} from '@angular/core';
import {FaqService} from '../faq.service';
import {Subscription} from 'rxjs/Subscription';
// import { AdminStore } from '../../components/adminChange/admin.store';
import { AdminService } from '../../shared/services/admin.service';
import { Meta } from '@angular/platform-browser';
import { AdminStore } from '../../admin/adminChange/admin.store';

@Component({
  selector: 'app-faq',
  templateUrl: 'faq.component.html',
  styleUrls: ['faq.component.scss']
})
export class FaqComponent implements OnInit, OnDestroy {
  images = {
    img_head: ''
  };
  subToggle = false;
  imagesOnInit: Subscription;
  getAllRecords: Subscription;
  getOneRecord: Subscription;

  constructor(
    private faq: FaqService,
    private adminStore: AdminStore,
    private meta: Meta,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.adminStore.savePageId(10);
    this.adminStore.changeMetaKey('Faq.Meta');
    this.getMeta();
    /** Request for static images */
    this.imagesOnInit = this.faq.getFaqStatic()
      .subscribe((data) => {
        console.log(data);
        this.images = data.basis.images;
      });

    this.getAllRecords = this.faq.getAllFaqRecords()
      .subscribe((data) => {
        console.log(data);
      });

    this.getOneRecord = this.faq.getOneFaqRecord(2)
      .subscribe((data) => {
        console.log(data);
      });

  }

  openSubMenu(query) {
    console.log(query);
    this.subToggle = !this.subToggle;
    const subMenu = document.querySelector(`.${query}`);
    console.log(subMenu);
    this.subToggle ? subMenu.classList.add('visibleMenu') : subMenu.classList.remove('visibleMenu');


  }
  test1() {
    console.log('DDDDDDDDDDDd');
  }


  ngOnDestroy() {
    // this.imagesOnInit.unsubscribe();
    this.getAllRecords.unsubscribe();
    this.getOneRecord.unsubscribe();
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
