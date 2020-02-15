import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {AdminStore} from '../admin.store';
import {AdminService} from '../../../shared/services/admin.service';
import {TranslateService} from '@ngx-translate/core';
import {NotifierService} from 'angular-notifier';


@Component({
  selector: 'app-admin-change',
  templateUrl: './admin-change.html',
  styleUrls: ['./admin-change.scss']
})
export class AdminChangeComponent implements OnInit {

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

  lang = true;

  constructor(
    public dialogRef: MatDialogRef<AdminChangeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public adminStore: AdminStore,
    public service: AdminService,
    public translate: TranslateService,
    private readonly notifier: NotifierService
  ) {
  }

  ngOnInit() {
    console.log(this.updateCred);
    if (this.adminStore.state.elementText) {
      this.checkLang();
      this.updateCred.key = this.adminStore.state.jsonId;
      this.updateCred.values.en = this.adminStore.state.reTranslate.en;
      this.updateCred.values.he = this.adminStore.state.reTranslate.he;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateTranslate() {
    // if (this.lang) {
    //   this.updateCred.values.en = this.adminStore.state.elementText.nativeElement.innerText;
    // } else if (!this.lang) {
    //   this.updateCred.values.he = this.adminStore.state.elementText.nativeElement.innerText;
    // }

    console.log(this.updateCred);
    this.service.updateTranslate(this.updateCred).subscribe(data => {
      console.log(data);
      this.notifier.notify('success', 'Text updated successfully. Reload page for check changes');
      this.dialogRef.close();
    }, error => {
      this.notifier.notify('error', 'Updating error');
      this.dialogRef.close();
      console.log(error);
    });
  }

  subscribeStateUpdates = (): void => {
    this.adminStore.state$.subscribe(state => {
      console.log(state);
    });
  };

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

  uploadImage(event) {
    const file = event.target.files[0];
    const fileId = this.adminStore.state.jsonId;
    const pageId = this.adminStore.state.currentPageId;
    this.service.uploadPhoto(file, fileId, pageId)
      .then(data => {
        console.log(data);
        this.adminStore.state.elementImg.nativeElement.src = data.basis.images[this.adminStore.state.jsonId];
      }, error => {
        console.log(error);
      });
  }

  uploadBackgroundImage(event) {
    console.log('you are in background change func');
    console.log(event);
    const file = event.target.files[0];
    const fileId = this.adminStore.state.jsonId;
    const pageId = this.adminStore.state.currentPageId;
    console.log(file, fileId, pageId);
    this.service.uploadPhoto(file, fileId, pageId)
      .then(data => {
        console.log(data);
        console.log(this.adminStore.state.elementBackground.nativeElement.style.backgroundImage);
        this.adminStore.state.elementBackground.nativeElement.style.backgroundImage =
          'url(' + data.basis.images[this.adminStore.state.jsonId] + ')';
        console.log(this.adminStore.state.elementBackground.nativeElement.style.backgroundImage);
      }, error => {
        console.log(error);
      });
  }




}
