import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AdminStore } from '../admin.store';
import { AdminService } from '../../../shared/services/admin.service'; 
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-pricing-change',
  templateUrl: './pricing-change.component.html',
  styleUrls: ['./pricing-change.component.scss']
})
export class PricingChangeComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PricingChangeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public adminStore: AdminStore,
    public service: AdminService,
    private readonly notifier: NotifierService
  ) { }

  slice;

  ngOnInit() {

  }


  updateSlice() {
    // console.log(this.adminStore.state.editSlice);
    this.slice = this.adminStore.state.editSlice;
    this.checkMedia(this.slice.pizza_image, 1);
    this.checkMedia(this.slice.save_image, 2);
    const id = this.slice.id;
    console.log(this.slice);
    this.service.updateSlice(this.slice, id)
    .then(data => {
      console.log(data);
      this.closeDialog();
      // location.reload();
    }, error => {
      console.log(error);
      this.notifier.notify('error', 'Tarrif updating error');
    });
  }

  subscribeStateUpdates = (): void => {
    this.adminStore.state$.subscribe(state => {
      console.log(state);
    });
  }

  show(e, num) {
    if (num === 1) {
      this.adminStore.state.editSlice.pizza_image = e.target.files[0];
    } else if (num === 2) {
      this.adminStore.state.editSlice.save_image = e.target.files[0];
    }
  }

  checkMedia(prop, num) {
    if (typeof prop === 'string' && num === 1) {
      delete this.slice.pizza_image;
      console.log(this.slice);
    } else if (typeof prop === 'string' && num === 2) {
      delete this.slice.save_image;
      console.log(this.slice);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
