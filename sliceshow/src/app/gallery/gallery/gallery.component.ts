import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig} from '@angular/material';
import {GalleryService} from '../../shared/services/gallery.service';
import {Subscription} from 'rxjs/Subscription';
// import { AdminStore } from '../../components/adminChange/admin.store';
// import { PlayPopupComponent } from '../../components/play-popup/play-popup.component';
import {AppStore} from '../../shared/store/app.store';
import {AdminService} from '../../shared/services/admin.service';
import {Meta} from '@angular/platform-browser';
import {AdminStore} from '../../admin/adminChange/admin.store';
import {PlayPopupComponent} from '../../shared/modals/play-popup/play-popup.component';

import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, OnDestroy {
  formData = new FormData ();
  clickEnable = true;
  currentLang = 'en';
  activeClassSwitcher = 'All';
  showSwitcher = '';
  sortSwitcher = 'trending';
  sortParam = 'trending';
  tags: Array<any> = [];
  filteredAnimationStyles: Array<any> = [];
  tag = {
    name: '',
    id: 0
  };
  images: Array<any> = [];
  dropdowns: Array<any> = [];
  allCategoriesOnInit: Subscription;
  allAnimationStyles: Subscription;
  oneAnimationStyle: Subscription;
  tagStatus = false;
  img = {
    img_head: '',
  };
  activeFilter = false;

  constructor(private gallery: GalleryService,
              private adminStore: AdminStore,
              public dialog: MatDialog,
              public store: AppStore,
              private meta: Meta,
              private activatedRoute: ActivatedRoute,
              private adminService: AdminService,
  ) {
  }

  ngOnInit() {

    this.currentLang = this.adminStore.getCurrentLang();
    this.adminStore.savePageId(17);
    this.adminStore.changeMetaKey('Gallery.Meta');
    this.getMeta();
    console.log(this.adminStore.newLang);

    this.gallery.getStaticData()
      .subscribe((data) => {
        console.log('galleryDATA');
        console.log(data);
        this.img = data.basis.images;
      });

    /** Getting all categories and subcategories for dropdown menu */
    this.allCategoriesOnInit = this.gallery.getAllCategories()
      .subscribe((data) => {
        // console.log(data);
        this.dropdowns = data;
        console.log(data);
      });

    // this.getAllAnimationStyles();
    this.subScribeToQueryParams();
    this.getAllTags();
    this.subscribeToChangeLang();
  }

  subScribeToQueryParams() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      console.log(params);
      if (params && params.id) {
        console.log('WITH PARAMS');
        this.getAllProjectsByCat(+params.id);
      } else {
        console.log('WITHOUT PARAMS');
        this.getAllAnimationStyles();
      }
    });
  }
  getAllProjectsByCat(projectId) {
    this.clickEnable = false;
    console.log(projectId);
    this.gallery.getAnimationStylesForCat(projectId).subscribe( (result) => {
      this.activeFilter = false;
      this.clickEnable = true;
      this.store.loadAnimationStyles(result);
      this.filteredAnimationStyles = this.store.state.animationStep3;
      // console.log(result);
    }, (error) => {
      this.clickEnable = true;
    });
  }
  subscribeToChangeLang() {
    this.adminStore.newLang.subscribe((result) => {
      this.currentLang = result;
      console.log( this.currentLang);
    }, (error) => {
      console.log(error);
    });
  }

  // TAGS

  getAllTags() {
    this.gallery.getAllTags()
      .subscribe((data) => {
        this.tags = data;
      });
  }

  handleTagSelected(data) {
    this.tag = data;
    this.filterTagsById(data);
  }

  filterTagsById(tag: any) {
    this.clickEnable = false;
    console.log(tag);
    this.gallery.searchByTags(tag.id)
      .subscribe((data) => {
        this.clickEnable = true;
        console.log(data);
        this.store.loadAnimationStyles(data.styles);
        this.filteredAnimationStyles = this.store.state.animationStep3;
      }, (error) => {
        this.clickEnable = true;
      });
  }

  filterTagsByName(event) {
    const query = event.search.toLowerCase().trim();
    if (query !== '') {
      this.filteredAnimationStyles = this._filterByTagsAndNames(this.store.state.animationStep3, query);
    } else {
      this.getAllAnimationStyles();
    }
  }

  _filterByTagsAndNames(arr, query): Array<any> {
    const result = [];
    arr.map(item => {
      if (item.name.toLowerCase().includes(query)) {
        result.push(item);
      } else {
        item.tags.map(tag => {
          if (tag.name.toLowerCase().includes(query)) {
            result.push(item);
          }
        });
      }
    });
    return result;
  }


  getAllAnimationStyles() {
    this.allAnimationStyles = this.gallery.getAllAnimationStyles()
      .subscribe(data => {
        console.log(data);
        this.activeFilter = false;
        this.store.loadAnimationStyles(data);
        this.filteredAnimationStyles = this.store.state.animationStep3;
      });
  }

  geAnimationStylesByHash(id) {
    this.clickEnable = false;
    console.log('geAnimationStylesByHash');
    this.oneAnimationStyle = this.gallery.geAnimationStylesByHash(id)
      .subscribe((data) => {
        this.clickEnable = true;
        this.activeFilter = true;
        this.images = data;
      }, (error) => {
        this.clickEnable = true;
      });
  }


  setActiveClass(value: string, dropdown = null): void {
    console.log(dropdown);
    if (dropdown !== null && this.clickEnable) {
      console.log('can select');
      this.getAllProjectsByCat(dropdown.id);
    }
    this.showSwitcher = value;
    this.activeClassSwitcher = value;
  }

  closeAllDropdowns() {
    this.showSwitcher = '';
  }

  setSortParam(value) {
    console.log('SET SORT PARAM');
    this.sortParam = value;
    this.sortSwitcher = value;
  }



  check(image) {
    // console.log(image);
  }

  subscribeStateUpdates = (): void => {
    this.adminStore.state$.subscribe(state => {
      // console.log(state);
    });
  }

  openPlayPopup(data) {
    console.log(data);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      'select_template_id': data.select_template_id
    };
    this.dialog.open(PlayPopupComponent, dialogConfig);
    // name your project after continue

  }

  getMeta() {
    this.removeDifMeta();
    this.meta.addTag({name: 'viewport', content: 'width=device-width'});
    this.adminService.getMetaTranslate(this.adminStore.state.metaKey, this.adminStore.state.currentLang)
      .subscribe((data) => {
      console.log(data);
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

  handleChosenPic(data) {
    this.store.saveStyleForPlay(data);
    this.store.changeAnimationStyleState(false);
    this.openPlayPopup(data);
  }

  ngOnDestroy() {
    this.allCategoriesOnInit.unsubscribe();
    if (this.allAnimationStyles) {
      this.allAnimationStyles.unsubscribe();
    }
    if (this.oneAnimationStyle) {
      this.oneAnimationStyle.unsubscribe();
    }
  }


}
