import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AdminService } from '../../shared/services/admin.service';

@Component({
  selector: 'app-add-subscriber-popup',
  templateUrl: './add-subscriber-popup.component.html',
  styleUrls: ['./add-subscriber-popup.component.scss']
})
export class AddSubscriberPopupComponent implements OnInit {
  newSubscriberForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddSubscriberPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public matDialog: MatDialog,
    private fb: FormBuilder, private service: AdminService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.initForm();
  }

  onSubmit() {
    const controls = this.newSubscriberForm.controls;
    if (this.newSubscriberForm.invalid) {
      Object.keys(controls)
        .forEach(controlName => controls[controlName].markAsTouched());
      return;
    }
    /** TODO: Обработка данных формы */
        console.log(this.newSubscriberForm);
        this.addSubscriber();
  }

  addSubscriber() {
    console.log(this.newSubscriberForm.value);
    this.service.addSubscriber(this.newSubscriberForm.value)
      .subscribe(data => {
        this.dialogRef.close();
      }, error => {
        console.log(error);
      });
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.newSubscriberForm.controls[controlName];
    const result = control.invalid && control.touched;
    return result;
  
  }

  private initForm() {
    this.newSubscriberForm = this.fb.group({
        email: ['', [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')
      ]
      ]
    });
  }


}
