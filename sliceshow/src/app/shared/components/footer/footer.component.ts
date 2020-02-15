import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminStore } from '../../../admin/adminChange/admin.store';
import { AuthService } from '../../services/auth.service';
import { ConfirmEmailPopupComponent } from '../../modals/confirm-email-popup/confirm-email-popup.component';
import { GalleryService } from '../../services/gallery.service';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
// import { ConfirmEmailPopupComponent } from '../confirm-email-popup/confirm-email-popup.component';
// import { AuthService } from '../../shared/services/auth.service';
// import { AdminStore } from '../adminChange/admin.store';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  subscribersForm: FormGroup;
  currentLang = 'en';
  categoriesNames: any;

  // @Input() label: any = '';
  // @Input() label1: any = '';

  constructor(public matDialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private galleryService: GalleryService,
    public adminStore: AdminStore,
    private service: AuthService) { }


  ngOnInit() {
    this.initForm();
    this.changeLanSubsc();
    this.getCategories();
  }

  openConfirm() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      subscription: true
    };


    const dialogRef = this.matDialog.open( ConfirmEmailPopupComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  onSubmit() {
    const controls = this.subscribersForm.controls;
    console.log(controls);
    if (this.subscribersForm.invalid) {
      Object.keys(controls)
        .forEach(controlName => controls[controlName].markAsTouched());
      return;
    } else {
      /** TODO: Обработка данных формы */
      // console.log('СДЕЛАТЬ Обработку данных формы');
      //            console.log(this.signUpForm.value);
      this.resandPass();
    }
  }


  getCategories() {
    this.galleryService.getAllCategories().subscribe( (result) => {
      console.log(result);
      this.collectCategoriesNames(result);
    }, (error) => {
      console.log(error);
    });
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.subscribersForm.controls[controlName];
    const result = control.invalid && control.touched;
    return result;
}


  collectCategoriesNames(categories) {
    this.categoriesNames = [];
    categories.map(cat => {
      this.categoriesNames.push({
        name: cat.name,
        name_hreb: cat.name_hreb,
        id: cat.id
      });
    });
  }

  changeLanSubsc() {
    this.adminStore.newLang.subscribe( (result) => {
      console.log(result);
      this.currentLang = result;
    });
  }


  resandPass() {
    console.log('resandPass');
  this.service.addSubscribers(this.subscribersForm.value)
        .subscribe(data => {
            console.log(data);
            this.openConfirm();
            // this.dialogRef.close();
        }, error => {
        });
  }

  private initForm() {
    this.subscribersForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')
      ]
      ]
    });
  }

  goToGallery(id = 0) {
   this.router.navigate(['gallery', {'id': `${id}`}]);
  }




}
