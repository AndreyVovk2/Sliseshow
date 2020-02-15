
import {filter} from 'rxjs/operators';
import { Component, AfterViewInit, OnInit, OnDestroy, ElementRef, HostListener, isDevMode } from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';
// import { NewPassComponent } from '../../components/new-pass-popup/new-pass.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { GalleryService } from '../../shared/services/gallery.service';
import { MainPageService } from '../main-page.service';
// import { SignInComponent } from '../../components/sign-in-popup/sign-in.component';

// import { AdminStore } from '../../components/adminChange/admin.store';
import { AppStore } from '../../shared/store/app.store';
import { AdminService } from '../../shared/services/admin.service';
import { Meta } from '@angular/platform-browser';
import { AdminStore } from '../../admin/adminChange/admin.store';
import { SignInComponent } from '../../shared/modals/sign-in-popup/sign-in.component';
import { NewPassComponent } from '../../shared/modals/new-pass-popup/new-pass.component';
// import { MainVideoPopupComponent } from '../../components/main-video-popup/main-video-popup.component';

// import { PopUpProjectNameComponent } from '../../components/pop-up-project-name/pop-up-project-name.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {
  categories: Array<any> = [];
  public carouselConfig: NgxCarousel;
  resetPop = '';
  categoriesOnInit: Subscription;
  sortParam = 'name';
  localData;
  carouselWidth = 320;
  carouselHeight = 240;
  widthCof = 1;
  @HostListener('window:resize', ['$event'])
    onResize(event) {
      if (event.target.innerWidth < 1200) {
        this.widthCof = 0.85;
      } else if (event.target.innerWidth < 1430) {
        this.widthCof = 0.7;
      } else if (event.target.innerWidth < 1650) {
        this.widthCof = 0.85;
      } else {
        this.widthCof = 1;
      }
    }

  // uploadVideoParam = false; // false - upload from media library, true - from browse
  // videoPreviewLink = 'https://slice-show.grassbusinesslabs.tk/storage/animation/screens/videos/video_92781537274253.mp4';


  constructor(
    private route: ActivatedRoute,
    public matDialog: MatDialog,
    private gallery: GalleryService,
    private adminStore: AdminStore,
    public store: AppStore,
    private meta: Meta,
    private rt: Router,
    private adminService: AdminService,
    public dialog: MatDialog,
    public el: ElementRef,
    private main: MainPageService

  ) {
    this.carouselConfig = {
      grid: {xs: 1, sm: 2, md: 3, lg: 5, all: 0},
      slide: 1,
      speed: 400,
      interval: 10000,
      point: {
        visible: false
      },
      loop: true
    };
  }

  ngOnInit() {
    this.checkWindowWidth();
    this.onLoadData();
    this.getCategories();
    this.checkParams();
    console.log(isDevMode());

  }

  checkWindowWidth() {
      if (window.innerWidth < 1200) {
      this.widthCof = 0.85;
    } else  if (window.innerWidth < 1430) {
      this.widthCof = 0.7;
    } else if (window.innerWidth < 1650) {
      this.widthCof = 0.85;
    } else {
      this.widthCof = 1;
    }
  }

  onLoadData() {
    this.adminStore.savePageId(18);
    this.adminStore.changeMetaKey('Main.Meta');
    this.getMeta();
    this.getPageMedia();
  }

  onMetadata(e, video) {
  //  console.log('metadata: ', e);
  //  console.log(e.srcElement.duration);
  //  e.srcElement.duration = 8;
  //  const player = this.el.nativeElement.querySelector('video');
  //     player.load();
  }

  ngOnDestroy() {
    this.categoriesOnInit.unsubscribe();
  }

  getPageMedia() {
    this.main.getDataMainPage()
    .subscribe(data => {
      this.localData = data.basis.images;
      // console.log(this.localData);
      setTimeout(() => {this.startPlayer(); });
    });
  }

  startPlayer() {
    const player = this.el.nativeElement.querySelector('video');
    // console.log(player);
    player.muted = true;
    player.load();
    player.play();
  }

  startCreating() {
    this.store.state.isAuthorized ? this.rt.navigate(['./create-project/step-one']) : this.openSignUp();
  }

  openSignUp() {
    const dialogRef = this.matDialog.open( SignInComponent );
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openPass() {
    const dialogRef = this.matDialog.open(NewPassComponent);
    dialogRef.afterClosed()
      .subscribe(result => {
        // console.log('The dialog was closed');
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

  show(event) {
    console.log('you are in video change func');
    this.localData.video_body1 = event.target.files[0];
    this.main.updateDataMainPage(this.localData.video_body1)
    .then(data => {
      // console.log(data);
      const responseData = JSON.parse(data);
      // console.log(responseData);
      this.localData = responseData.basis.images;
      this.startPlayer();
    });
  }


  getCategories() {
    this.categoriesOnInit = this.gallery.getAllCategories()
    .subscribe((data) => {
      // console.log(data);
      this.categories = data;
    });
  }

  checkParams() {
    localStorage.removeItem('resendMail');
    window.scrollTo(0, 0);
    this.route.queryParams.pipe(
      filter(params => params.resetPop))
      .subscribe(params => {
        this.resetPop = params.resetPop;
        if (this.resetPop === 'a') {
          // console.log(params);
          setTimeout(() => this.openPass());
        }
      });
  }

}
