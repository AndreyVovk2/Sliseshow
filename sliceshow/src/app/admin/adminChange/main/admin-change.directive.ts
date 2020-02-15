import { Directive, ElementRef, HostListener, Input} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AdminChangeComponent } from './admin-change';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { AdminStore } from '../admin.store';
import { AppStore } from '../../../shared/store/app.store';
import { AdminService } from '../../../shared/services/admin.service';

@Directive({
  selector: '[appAdminChange]'
})
export class AdminChangeDirective {
  // reTranslate = {en: '', he: ''};
  constructor(
    private el: ElementRef,
    public matDialog: MatDialog,
    private http: HttpClient,
    public adminStore: AdminStore,
    public store: AppStore,
    public service: AdminService
  ) {
  }

  @Input('appAdminChange') jsonId: string;

  // @Input() highlightColor: string;

  @HostListener('mouseenter', ['$event']) onMouseEnter(event) {
    event.stopPropagation();
    event.preventDefault();
    if (this.store.state.authCredentials && this.store.state.authCredentials.admin === 1) {
      if (this.el.nativeElement.localName === 'img' || this.el.nativeElement.style.backgroundImage !== '') {
        this.el.nativeElement.style.opacity = 0.5;
      } else {
      // console.log(this.el);
      this.el.nativeElement.style.backgroundColor = 'orange';
      this.el.nativeElement.style.opacity = 1;
    }
    }
  }

  @HostListener('mouseleave', ['$event']) onMouseLeave(event) {
    event.stopPropagation();
    if (this.store.state.authCredentials && this.store.state.authCredentials.admin === 1) {
    // this.highlight(null, null);
    this.el.nativeElement.style.backgroundColor = null;
    this.el.nativeElement.style.opacity = 1;
    }
  }

  @HostListener('contextmenu', ['$event']) onDoubleClick(event) {
    if (this.store.state.authCredentials && this.store.state.authCredentials.admin === 1) {
        event.stopPropagation();
        event.preventDefault();
        console.log(this.el);
      if (this.el.nativeElement.style.backgroundImage) {
        this.adminStore.saveElemBackground(this.el);
        this.adminStore.saveKey(this.jsonId);
        this.openPopup();
        console.log(this.el);
      } else {
        if (this.el.nativeElement.localName === 'img') {
          this.adminStore.saveElemImg(this.el);
          this.adminStore.saveKey(this.jsonId);
          this.openPopup();
        } else {
          this.adminStore.saveElemText(this.el);
          this.adminStore.saveKey(this.jsonId);
          this.service.getTranslate(this.jsonId)
          .subscribe(data => {
            this.adminStore.saveTranslate(data);
            this.openPopup();
          }, error => {
            console.log(error);
          });
          }
        }
      }
    }

  openPopup() {
    const dialogRef = this.matDialog.open( AdminChangeComponent );
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  subscribeStateUpdates = (): void => {
    this.adminStore.state$.subscribe(state => {
      console.log(state);
    });
    this.store.state$.subscribe(state => {
      console.log(state);
    });
  }


}
