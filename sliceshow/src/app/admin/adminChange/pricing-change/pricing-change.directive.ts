import { Directive, ElementRef, HostListener, Input} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PricingChangeComponent } from './pricing-change.component';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { AdminStore } from '../admin.store';
import { AppStore } from '../../../shared/store/app.store';
import { AdminService } from '../../../shared/services/admin.service';

@Directive({
  selector: '[appPricingChange]'
})
export class PricingChangeDirective {



  constructor(
    private el: ElementRef,
    public matDialog: MatDialog,
    private http: HttpClient,
    public adminStore: AdminStore,
    public store: AppStore,
    public service: AdminService
  ) {
  }

  @Input('appPricingChange') jsonId: number;


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
    if (this.store.state.authCredentials && this.store.state.authCredentials.admin === 1) {
      event.stopPropagation();
      event.preventDefault();
      this.service.getEditSlice(this.jsonId)
      .subscribe(data => {
        // delete data.pizza_image;
        // delete data.save_image;
        console.log(data);

        this.adminStore.saveSlice(data);
        this.openPopup();
      }, error => {
        console.log(error);
      });
    
  }
    
  }


  openPopup() {
    const dialogRef = this.matDialog.open( PricingChangeComponent );
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
