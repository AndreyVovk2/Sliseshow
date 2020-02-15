import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { GalleryService } from '../../shared/services/gallery.service';
import { HostListener, Inject } from '@angular/core';
import { AppStore } from '../../shared/store/app.store';
import { Router} from '@angular/router';
import { AdminService } from '../../shared/services/admin.service';
import { Meta } from '@angular/platform-browser';
import { AdminStore } from '../../admin/adminChange/admin.store';

@Component({
  selector: 'app-create-project-step-two',
  templateUrl: './create-project-step-two.component.html',
  styleUrls: ['./create-project-step-two.component.scss']
})
export class CreateProjectStepTwoComponent implements OnInit, OnDestroy {
  activeClassSwitcher = 'All';
  showSwitcher = '';
  images: Array<any> = [];
  subcat: Array<any> = [];
  categories: Array<any> = [];
  isLoaded = false;
  amount = 3;
  pageHeight = 150;
  selectedCategory;
  public fixed: boolean;
  allCategoriesOnInit: Subscription;
  allAnimationStyles: Subscription;
  oneAnimationStyle: Subscription;


  constructor(
    private gallery: GalleryService, 
    public store: AppStore, 
    public rt: Router, 
    private adminStore: AdminStore, 
    private meta: Meta,
    private adminService: AdminService,
    private router: Router
  ) { }

  @HostListener('window:scroll', ['$event'])
    onWindowScroll(event) {
      const number = window.scrollY;
      if (number > this.pageHeight) {
        this.amount += 3;
        this.pageHeight += 300;
      }
      if (this.store.state.basket.length > 0 && number >= 430) {
        this.fixed = true; 
      } else { this.fixed = false; }
  }

  ngOnInit() {
    if (!this.store.state.selectSlice) {
      this.rt.navigate(['/create-project/step-one']);
    }
    
    window.scroll(0, 0);
    this.adminStore.changeMetaKey('StepTwo.Meta');
    this.getMeta();
    /** Getting all categories and subcategories for dropdown menu */
    // this.allCategoriesOnInit = this.gallery.getAllCategories()
    //   .subscribe((data) => {
    //     // console.log(data);
    //     this.isLoaded = true;
    //     this.dropdowns = data;
    // });
   this.getAllCategories();
   this.getAllSubcat();
   console.log(this.store);
  
    // this.getAllAnimationStyles();
  }

  getAllCategories() {
    this.gallery.getAllCategories()
    .subscribe(data => {
      console.log(data);
      this.categories = data;
  });
  }

  getAllSubcat() {
    this.allCategoriesOnInit = this.gallery.allSubcategories()
    .subscribe(data => {
      console.log(data);
      this.isLoaded = true;
      this.subcat = data;
  });
  }

  getSelectSubcat(id: number) {
    console.log(id);
    this.gallery.getOneCategory(id)
    .subscribe(data => {
      console.log(data);
      window.scroll(0, 0);
      this.amount = 6;
      this.pageHeight = 150;
      this.isLoaded = true;
      this.subcat = data.subcategories;
  });
  }

  ngOnDestroy() {
    this.allCategoriesOnInit.unsubscribe();
    // this.allAnimationStyles.unsubscribe();
    if (this.oneAnimationStyle) {
      this.oneAnimationStyle.unsubscribe();
    }
  }

  // getAllAnimationStyles() {
  //   this.allAnimationStyles = this.gallery.getAllAnimationStyles()
  //     .subscribe((data) => {
  //       // this.images = data;
  //     });
  // }

  geAnimationStylesByHash(id) {
    console.log(id);
    this.oneAnimationStyle = this.gallery.geAnimationStylesByHash(id)
      .subscribe((data) => {
        // this.images = data;
        console.log(data);
      });
  }

  toNextStep() {
    if (this.store.state.listOfCategory.length > 0) {
      this.rt.navigate(['/create-project/step-three']);
    }
  }




  setActiveClass(value: string): void {
    this.showSwitcher = value;
    this.activeClassSwitcher = value;
  }

  closeAllDropdowns() {
    this.showSwitcher = '';
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

  continueWithoutSelecting() {
    this.store.clearCategories();
    this.rt.navigate(['/create-project/step-three']);
    // this.store.clearCategories();
    // this.router.navigateByUrl('/create-project-step-three');
  }

  subscribeStateUpdates = (): void => {
    this.store.state$.subscribe(state => {
      console.log(state);
    });
  }


}
