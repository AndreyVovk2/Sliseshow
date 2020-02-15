import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AboutUsService} from '../about-us.service';
import {Subscription} from 'rxjs/Subscription';
// import { AdminStore } from '../../components/adminChange/admin.store';
import { AdminService } from '../../shared/services/admin.service';
import { Meta } from '@angular/platform-browser';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { AdminStore } from '../../admin/adminChange/admin.store';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit, OnDestroy {
  images = {
    img_head: '',
    img_body1: '',
    img_body2: '',
    img_body3: ''
  };
  imagesOnInit: Subscription;

  constructor(
    private rt: Router, 
    private aboutUs: AboutUsService, 
    public dialog: MatDialog,
    private adminStore: AdminStore, 
    private meta: Meta,
    private adminService: AdminService
  ) {

  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.adminStore.savePageId(1);
    this.adminStore.changeMetaKey('AboutUs.Meta');
    this.getMeta();


    this.imagesOnInit = this.aboutUs.getDataAboutUs()
      .subscribe((data) => {
        // console.log(data);
        this.images = data.basis.images;
      });


  }

  ngOnDestroy() {
    this.imagesOnInit.unsubscribe();
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


}
