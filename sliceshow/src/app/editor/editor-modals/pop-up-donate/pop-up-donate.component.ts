import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {PopUpPayComponent} from '../pop-up-pay/pop-up-pay.component';
import { ProjectService } from '../../../shared/services/project.service';
import { EditingStore } from '../../store/editing.store';
import { AppStore } from '../../../shared/store/app.store';


@Component({
  selector: 'app-pop-up-donate',
  templateUrl: 'pop-up-donate.component.html',
  styleUrls: ['pop-up-donate.component.scss']
})
export class PopUpDonateComponent implements OnInit {

  public selectedQuality = { price: 0, quality: 720};
  private tariffId = 1;
  public projectQualities = [];
  private projectPrice: number;
  private currQuality;



  constructor(
    public dialog: MatDialog, 
    public dialogRef: MatDialogRef<PopUpDonateComponent>,
    public project: ProjectService,
    public editingStore: EditingStore,
    public store: AppStore,

  ) { }

  ngOnInit() {
    this.editingStore.getAllQualities();
    this.editingStore.countPrice();
    this.getProjectQualities();
  }


  onClose(): void {
    this.dialogRef.close();
  }

  addExtraPrice (item) {
    this.currQuality = item;
    this.projectPrice = this.editingStore.state.project.final_price;
    // console.log(this.currQuality);
    this.projectPrice += item.price;
    // console.log( this.projectPrice);

  }

  getProjectQualities() {
    this.project.getProjectQualities(this.editingStore.state.project.id).subscribe(
      (result) => {
        this.projectQualities = result;
        console.log(this.projectQualities);
        this.setDefQuality ();
      },
      (error) => {

        }
    );
  }
  setDefQuality () {
    this.projectQualities.forEach((e) => {
      if (e.quality === '720p') {
        this.currQuality = e;
        // console.log(this.currQuality);
      }
    });
  }

  // changeQuality(price: number, quality: number) {
  //   this.selectedQuality.price = price;
  //   this.selectedQuality.quality = quality;
  //   console.log(this.selectedQuality);
  // }

  // Project ID + price
  createInvoice() {
    this.addExtraPrice(this.currQuality);
    const project_id = this.editingStore.state.project.id;
    // const price = this.editingStore.state.project.final_price;
    const price = this.projectPrice;
    const quality_id = this.currQuality.id;
    // const quality_id = this.tariffId;
    const obj = {project_id, price, quality_id};
    // console.log(obj);
    this.project.createPayInvoice(obj)
    .subscribe(data => {
      // console.log(data);
      this.store.setInvoice(data.id);
      this.submitForm();
    });
  }

  submitForm() {
    const dialogRef = this.dialog.open(PopUpPayComponent, {
      data: {
        price: `${this.projectPrice}`,
        quality:  this.currQuality.quality
      }, 
    });
    this.onClose();
  }

  checkPrice (price) {
    if (price === 0) {
      return 'Default';
    } else {
      return price + ' $';
    }
  }

}
