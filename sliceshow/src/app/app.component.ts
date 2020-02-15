import {Component, OnInit} from '@angular/core';
import {TitleService} from './shared/services/title.service';
import {TranslateService} from '@ngx-translate/core';
// import { AdminStore } from './components/adminChange/admin.store';
import {Meta} from '@angular/platform-browser';
import {AdminService} from './shared/services/admin.service';
import {AdminStore} from './admin/adminChange/admin.store';

import 'hammerjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  lang = 'ltr';

  constructor(private titleService: TitleService,
              private translate: TranslateService,
              private adminStore: AdminStore,
              private meta: Meta,
              private adminService: AdminService
  ) {
    translate.setDefaultLang('en');
    this.adminStore.updateLang('en');

  }

  public switchLanguage(language: string) {
    this.translate.use(language);
    if (language === 'en') {
      this.lang = 'ltr';
      this.adminStore.updateLang('en');
      console.log(this.lang);
    } else if (language === 'he') {
      this.lang = 'rtl';
      this.adminStore.updateLang('he');
      console.log(this.lang);
    }
    this.getMeta();
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

  ngOnInit(): void {
    this.titleService.init();
    this.alertWhenClose();
  }

  alertWhenClose() {
    window.addEventListener('beforeunload', function (e) {
      const confirmationMessage = `It looks like you have been editing something. `
        + ` If you leave before saving, your changes will be lost.`;
      (e || window.event).returnValue = confirmationMessage; //Gecko + IE
      return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
    });

  }
}
