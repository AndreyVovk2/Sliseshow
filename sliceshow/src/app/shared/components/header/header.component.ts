import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { SignInComponent } from '../sign-in-popup/sign-in.component';
// import { PopUpVerifyEmailComponent } from '../pop-up-verify-email/pop-up-verify-email.component';
import { Router } from '@angular/router';
// import {AppComponent} from '../../app.component';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from '../../../app.component';
import { AppStore } from '../../store/app.store';
import { AdminStore } from '../../../admin/adminChange/admin.store';
import { LibraryStore } from '../../../my-library/store/library.store';
import { SignInComponent } from '../../modals/sign-in-popup/sign-in.component';
import { MetaChangeComponent } from '../../../admin/adminChange/meta-change/meta-change.component';
// import { AppStore } from '../../shared/store/app.store';
// import { MetaChangeComponent } from '../adminChange/meta-change/meta-change.component';
// import { AdminStore } from '../adminChange/admin.store';
// import { LibraryStore } from '../../my-library/store/library.store';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isOpenUserMenu = false;
  isOpenLanguage = false;
  isOpenAdminMenu = false;
  isRegistered = false;
  isOpenMainMenu = false;

  constructor(public matDialog: MatDialog,
    public rt: Router,
    public appcomp: AppComponent,
    private translate: TranslateService,
    public store: AppStore,
    public adminStore: AdminStore,
    private library: LibraryStore
  ) {

   }


/*  change = (increased:boolean): void => {
    this.translate.setTranslation(increased ? 'en' : 'he');
  }*/

  onChangeEn() {
    this.appcomp.switchLanguage('en');
    localStorage.setItem('language', 'en');
  }

  onChangeHe() {
    this.appcomp.switchLanguage('he');
    localStorage.setItem('language', 'he');
  }

  ngOnInit() {
    this.subscribeStateUpdates();
    // if (localStorage.getItem('currentUser') !== null) {
    //   this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    //   this.isRegistered = true;
    // }
    // console.log(this.store.state.authCredentials);
  }

  toggleClassUserMenu() {
    if (this.isOpenLanguage) {
      this.isOpenLanguage = false;
    }
    this.isOpenAdminMenu = false;
    this.isOpenUserMenu = !this.isOpenUserMenu;
  }

  toggleClassLanguage() {
    if (this.isOpenUserMenu) {
      this.isOpenUserMenu = false;
    }
    this.isOpenAdminMenu = false;
    this.isOpenLanguage = !this.isOpenLanguage;
  }

  toggleClassMainMenu() {
    this.isOpenMainMenu = !this.isOpenMainMenu;
  }

  toggleClassAdminMenu() {
    this.isOpenLanguage = false;
    this.isOpenUserMenu = false;
    this.isOpenAdminMenu = !this.isOpenAdminMenu;
  }

  closeAllPopovers() {
    this.isOpenLanguage = false;
    this.isOpenUserMenu = false;
    this.isOpenAdminMenu = false;
  }

  logOut() {
    this.store.removeUser();
    this.library.clearStore();
    this.rt.navigate(['']);
  }

  openPopup() {
    const dialogRef = this.matDialog.open( SignInComponent );
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openModalMeta() {
    const dialogRef = this.matDialog.open( MetaChangeComponent );
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  subscribeStateUpdates = (): void => {
    this.store.state$.subscribe(state => {
      // console.log(state);
    });
  }
}
