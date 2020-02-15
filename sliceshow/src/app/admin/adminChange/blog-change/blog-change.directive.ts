import { Directive, ElementRef, HostListener, Input} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BlogChangeComponent } from './blog-change.component';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { AdminStore } from '../admin.store';
import { AppStore } from '../../../shared/store/app.store';
import { BlogRequestService } from '../../../blog/blog-request.service';

@Directive({
  selector: '[appBlogChange]'
})
export class BlogChangeDirective {

  constructor(
    private el: ElementRef,
    public matDialog: MatDialog,
    private http: HttpClient,
    public adminStore: AdminStore,
    public store: AppStore,
    public service: BlogRequestService
  ) {
  }

  @Input('appBlogChange') jsonId: any;

  @HostListener('mouseenter', ['$event']) onMouseEnter(event) {
    if (this.store.state.authCredentials && this.store.state.authCredentials.admin === 1) {
    event.stopPropagation();
    this.el.nativeElement.style.border = '1px solid black';
    this.el.nativeElement.style.cursor = 'pointer'; 
    }
  }

  @HostListener('mouseleave', ['$event']) onMouseLeave(event) {
    if (this.store.state.authCredentials && this.store.state.authCredentials.admin === 1) {
    event.stopPropagation();
    this.el.nativeElement.style.border = '1px solid transparent';
    this.el.nativeElement.style.cursor = 'default'; 
    }
  }
  // contextmenu
  @HostListener('click', ['$event']) onClick(event) {
    console.log('I am here event');
    if (this.store.state.authCredentials && this.store.state.authCredentials.admin === 1) {
      if (this.jsonId === 'createNewBlog') {
        event.stopPropagation();
        event.preventDefault();
        this.adminStore.createNewBlog();
        this.openPopup();
      }
    event.stopPropagation();
    event.preventDefault();
    const arr = this.adminStore.state.blogList;
    console.log(this.jsonId);
    console.log(this.adminStore.state.blogList);
    arr.forEach(v => {
      if (v.id == this.jsonId) {
        this.adminStore.saveBlogEdit(v);
        this.openPopup();
      }
    });
  }
  }

  openPopup() {
    const dialogRef = this.matDialog.open( BlogChangeComponent );
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
