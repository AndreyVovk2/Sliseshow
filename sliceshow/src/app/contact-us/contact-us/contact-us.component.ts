import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ContactUsService} from '../contact-us.service';
import {FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';

import {AdminService} from '../../shared/services/admin.service';
import {Meta} from '@angular/platform-browser';
import {AdminStore} from '../../admin/adminChange/admin.store';
import {AdminChangeComponent} from '../../admin/adminChange/main/admin-change';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit, OnDestroy {
  translateEn: string;
  translateHe: string;
  translateTelEn: string;
  translateTelHe: string;
  lang = true;

  updateCred = {
    key: '',
    // this.adminStore.state.jsonId,
    values: {
      en: '',
      // this.adminStore.state.reTranslate.en,
      he: ''
      // this.adminStore.state.reTranslate.he
    }
  };

  contactUsForm: FormGroup;
  lat = 31.9765;
  lng = 34.7771;
  zoom = 15;

  images = {
    img_head: ''
  };
  imagesOnInit: Subscription;

  constructor(private contact: ContactUsService,
              private adminStore: AdminStore,
              private fb: FormBuilder,
              private meta: Meta,
              private adminService: AdminService,
              private translate: TranslateService,
  ) {
  }

  ngOnInit() {
    this.generateContactForm();
    this.adminStore.savePageId(11);
    this.adminStore.changeMetaKey('ContactUs.Meta');
    this.getMeta();
    this.adminService.GetTranslateEn().subscribe(res => {
      if (localStorage.getItem('language') === 'he') {
        this.translateEn = res.he ;
      } else {
        this.translateEn = res.en;
      }
    });
    this.adminService.GetTranslateHe().subscribe(res => {
      console.log('translate he: ' + `${res}`);
      if (localStorage.getItem('language') === 'he') {
        this.translateTelEn = res.he;
      } else {
        this.translateTelEn = res.en;
      }


    });
    console.log(this.updateCred);
    if (this.adminStore.state.elementText) {
      this.checkLang();
      this.updateCred.key = this.adminStore.state.jsonId;
      this.updateCred.values.en = this.adminStore.state.reTranslate.en;
      this.updateCred.values.he = this.adminStore.state.reTranslate.he;

    }
    console.log(this.adminStore.state.reTranslate);
    this.imagesOnInit = this.contact.getContactUs()
      .subscribe((data) => {
        console.log(data);
        this.images = data.basis.images;
      });
  }


  checkLang() {
    if (this.translate.currentLang) {
      if (this.translate.currentLang === 'en') {
        this.lang = true;
        this.adminStore.updateLang('en');
      } else if (this.translate.currentLang === 'he') {
        this.lang = false;
        this.adminStore.updateLang('he');
      }
    } else if (this.translate.defaultLang === 'he') {
      this.lang = false;
      this.adminStore.updateLang('he');
    } else if (this.translate.defaultLang === 'en') {
      this.lang = true;
      this.adminStore.updateLang('en');
    }
  }

  generateContactForm() {
    this.contactUsForm = this.fb.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      email: ['', Validators.compose(
        [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')
        ])],
      message: ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });
  }

  ngOnDestroy() {
    this.imagesOnInit.unsubscribe();
  }

  subscribeStateUpdates = (): void => {
    this.adminStore.state$.subscribe(state => {
      console.log(state);
    });
  };

  getMeta() {
    this.removeDifMeta();
    this.meta.addTag({name: 'viewport', content: 'width=device-width'});
    this.adminService.getMetaTranslate(this.adminStore.state.metaKey, this.adminStore.state.currentLang)
      .subscribe((data) => {
        this.meta.addTags(data);
      });
  }

  removeDifMeta() {
    const metas = this.meta.getTags('name');
    metas.forEach(elem => {
      this.meta.removeTag('name= ' + elem.name);
    });
  }

  contactUsSubmit() {
    console.log(this.contactUsForm.value);
  }

}
