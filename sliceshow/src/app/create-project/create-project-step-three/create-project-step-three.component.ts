import {Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig} from '@angular/material';
import {Subscription} from 'rxjs/Subscription';
import {GalleryService} from '../../shared/services/gallery.service';
import {AppStore} from '../../shared/store/app.store';
import {PricingService} from '../../pricing/pricing.service';
import {HostListener, Inject} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import {Router, ActivatedRoute} from '@angular/router';
import {AdminService} from '../../shared/services/admin.service';
import {Meta} from '@angular/platform-browser';
import {AdminStore} from '../../admin/adminChange/admin.store';
import {PopUpOneSliceComponent} from '../../shared/modals/pop-up-one-slice/pop-up-one-slice.component';
import {PopUpLeftComponent} from '../../shared/modals/pop-up-left/pop-up-left.component';
import {PopUpProjectNameComponent} from '../../shared/modals/pop-up-project-name/pop-up-project-name.component';
import {PlayPopupComponent} from '../../shared/modals/play-popup/play-popup.component';
import {ProjectService} from '../../shared/services/project.service';
import {AdminChangeComponent} from '../../admin/adminChange/main/admin-change';
import {PopUpNotPaidComponent} from '../../shared/modals/pop-up-not-paid/pop-up-not-paid.component';


@Component({
  selector: 'app-create-project-step-three',
  templateUrl: './create-project-step-three.component.html',
  styleUrls: ['./create-project-step-three.component.scss']
})

export class CreateProjectStepThreeComponent implements OnInit, OnDestroy {
  public toggleBasket = false;
  sortParam = 'trending';
  images: Array<any> = [];
  isLoaded = false;
  addSliceData: any;
  notPaid: number;
  isAddSlice: false;
  paids = [];
  public fixed = false;
  stylesAmount = 6;
  pageHeight = 300;
  allAnimationStyles: Subscription;

  @ViewChild('gallery_main') content: ElementRef;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    const number = window.scrollY;
    const contentHeight = this.content.nativeElement.clientHeight;
    if (number >= contentHeight / 2) {
      this.pageHeight += 300;
      this.stylesAmount += 3;
    }
    if (number >= 555) {
      this.fixed = true;
    } else {
      this.fixed = false;
    }
  }

  constructor(
    public dialog: MatDialog,
    private gallery: GalleryService,
    public store: AppStore,
    public pricing: PricingService,
    public project: ProjectService,
    public rt: Router,
    private matDialog: MatDialog,
    private adminStore: AdminStore,
    private meta: Meta,
    private adminService: AdminService,
    private route: ActivatedRoute
    // @Inject(DOCUMENT) private document: Document
  ) {
  }

  ngOnInit() {

    this.addSliceData = this.store.getAddSliceData();
    this.subscribeStateUpdates();
    console.log(this.addSliceData);
    this.isAddSlice = this.addSliceData ? this.addSliceData.addSlice : false;
    console.log(this.isAddSlice);

    window.scroll(0, 0);
    this.adminStore.changeMetaKey('StepThree.Meta');
    this.getMeta();

    if (!this.store.state.selectSlice) {
      this.rt.navigate(['/create-project/step-one']);
    }

    if (this.store.state.allTariffs.length === 0) {
      this.getAllAnimations();
    }

    if (this.store.state.listOfCategory.length === 0) {
      this.getAllAnimationStyles();
    } else {
      this.getSelectedAnimationStyles();
    }
  }

  noPaid() {
    this.project.getPaid().subscribe(res => {
      console.log(res);
      this.paids = res;
      this.notPaid = res.count;
      if (this.notPaid > 2) {
        this.errorPaid();
      } else {
        this.openDialogProjectName();
      }
    });
  }

  handleChosenPic(data) {
    this.store.changeAnimationStyleState(true);
    this.store.saveStyleForPlay(data);
    // data.select_pic, data.select_duration
    this.openPlayPopup(data, data.select_pic, data.select_duration, data.select_template_id);

  }

  checkAddSliceState(arr: Array<any>) {
    let templateId: number;
    let picsNumber: number;
    console.log(this.addSliceData.selectedSlices);
    arr.map(c => {
      this.addSliceData.selectedSlices.map(v => {
        if (c.id === v.animation_style_id) {
          picsNumber = v.pics;
          c.templates.map(template => {
            if (template.pics === picsNumber) {
              templateId = template.id;
            }
          });
          console.log(c, v);
          const formatedStyle = {
            ...c,
            clicked: true,
            select_pic: v.pics,
            select_duration: v.duration,
            types: v.types,
            select_template_id: templateId
          };

          console.log(formatedStyle);
          this.store.saveStyle(formatedStyle);
        }
        return v;
      });
      return c;
    });
    console.log(this.store.state.basket);
  }

  getAllAnimations() {
    this.pricing.getTariffs()
      .subscribe(data => {
        this.isLoaded = true;
        data.forEach(v => {
          this.store.saveTariffs(v);
        });
      });
  }

  getSelectedAnimationStyles = () => {
    // debugger; // tslint-disable-line
    this.store.removeAnimationStyles();
    this.gallery.getSelectedAnimationStyle({
      categories: this.store.state.listOfCategory
    }).subscribe((data) => {
      this.isLoaded = true;
      if (this.isAddSlice) {
        this.checkAddSliceState(data);
      }
      this.store.loadAnimationStyles(data);

    });
    // TODO: change anStyle to data from promise
    // this.store.loadAnimationStyles(this.anStyle);
  };

  getAllAnimationStyles = () => {
    this.store.removeAnimationStyles();
    this.gallery.getAllAnimationStyles()
      .subscribe((data) => {
        // console.log(data);
        if (this.isAddSlice) {
          this.checkAddSliceState(data);
        }
        this.store.loadAnimationStyles(data);
        this.isLoaded = true;
      });
    // TODO: change anStyle to data from promise
    // this.store.loadAnimationStyles(this.anStyle);
  };

  openDialogOneSlice() { // show when user must upgrade tariff
    const ref = this.dialog.open(PopUpOneSliceComponent);
    const sub = ref.componentInstance.onAdd.subscribe((data) => {
      return data;
    });
  }

  openDialogLeft() { // show when user have unused slice
    const dialogConfig = new MatDialogConfig;
    dialogConfig.data = {
      usedSlices: this.store.state.basket.length,
      totalSlices: this.store.state.selectSlice.slices,
      // amount: +selectDuration
    };
    const dialogRef = this.dialog.open(PopUpLeftComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) {
        this.dialog.open(PopUpProjectNameComponent);
      }
    });
  }




  openDialogProjectName() {
    if (this.store.state.basket.length < this.store.state.selectSlice.slices) {
      this.openDialogLeft();
    } else if (this.store.state.basket.length !== 0) {
      this.dialog.open(PopUpProjectNameComponent);
    }

    // if (this.store.state.basket.length !== 0) {
    //   this.dialog.open(PopUpProjectNameComponent);
    // }sa

  }

  errorPaid() {
    const prom = new Promise(() => {
      const dialogRef = this.matDialog.open(PopUpNotPaidComponent);
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
      });

    });
  }


  goToEditingSystem() {
    console.log(this.store.state.basket);
    console.log(this.store.state);
    const templatesId = this.store.state.basket.map(e => (
      e.select_template_id));
    // const animationStyles = this.store.state.basket.map(e => ({
    //     style: e.id, pics: e.select_pic
    //   })
    // );
    const data = {
      tariff: this.store.state.selectSlice.id,
      project: this.addSliceData.projectId,
      templates: templatesId
    };
    console.log(data);
    this.project.changeAnimationStyleProject(data).subscribe(res => {
      // if (res.status === 'created') {
      this.rt.navigate(['/editing-system/' + btoa(res.id)]);
      // }
    });
  }


  openPlayPopup(data, selectPic, selectDuration, select_template_id) { // name your project after continue
    const dialogConfig = new MatDialogConfig();

    // this.dialog.open(PlayPopupComponent, {
    //   select_pic: pic;
    // });
    // pic, dur
    // const dialogConfig = new MatDialogConfig;
    // dialogConfig.data = {
    //   select : +selectPic,
    //   duration : +selectDuration,
    //   // amount: +selectDuration
    // };
    dialogConfig.data = {

      wholeData: data,
      select_template_id: select_template_id
    };
    const dialogRef = this.dialog.open(PlayPopupComponent, dialogConfig);
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

  subscribeStateUpdates = (): void => {
    this.store.state$.subscribe(state => {
      // console.log(state);
    });
  };

  ngOnDestroy() {
    this.store.cleanBasket();
  }


}
