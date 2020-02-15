import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {GalleryService} from '../../shared/services/gallery.service';
// import { AdminStore } from '../../components/adminChange/admin.store';
import { AppStore } from '../../shared/store/app.store';
import { AdminStore } from '../../admin/adminChange/admin.store';
import { PlayPopupComponent } from '../../shared/modals/play-popup/play-popup.component';
// import { PlayPopupComponent } from '../../components/play-popup/play-popup.component';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  sortParam = 'trending';
  images: Array<any> = [];
  fav: Subscription;

  constructor(
    private gallery: GalleryService,
    private adminStore: AdminStore,
    public dialog: MatDialog,
    private store: AppStore
  ) {

  }

  ngOnInit() {
    this.getAllFavorites();
    this.adminStore.changeMetaKey('withoutMeta');
  }

  ngOnDestroy() {
    // this.allAnimationStyles.unsubscribe();
  }

  getAllFavorites() {
    this.fav = this.gallery.getAllFavorites()
      .subscribe((data) => {
        console.log(data);
        this.images = data;
      });
  }

  openPlayPopup() { // name your project after continue
    this.dialog.open(PlayPopupComponent);
  }

  handleChosenPic(data) {
    this.store.saveStyleForPlay(data);
    this.store.changeAnimationStyleState(false);
    this.openPlayPopup();
  }
}



