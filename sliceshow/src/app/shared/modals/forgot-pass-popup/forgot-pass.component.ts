import { Component, Inject, OnInit} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NewPassComponent } from '../new-pass-popup/new-pass.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
// import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.scss']
})
export class ForgotPassComponent implements OnInit {
    forgotPassForm: FormGroup;
    pending = false;
    showError = false;
    messageError = '';

  constructor(
    public dialogRef: MatDialogRef<ForgotPassComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public matDialog: MatDialog, private fb: FormBuilder, private service: AuthService) { }

  ngOnInit() {
    this.initForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
        const controls = this.forgotPassForm.controls;
        if (this.forgotPassForm.invalid) {
          Object.keys(controls)
            .forEach(controlName => controls[controlName].markAsTouched());
          return;
        }
        /** TODO: Обработка данных формы */
//            console.log(this.signUpForm.value);
            this.resandPass();
        }
  resandPass() {
    this.pending = true;
      this.service.sandMailRepass(this.forgotPassForm.value)
            .subscribe(data => {
                console.log(data);
                this.pending = false;
                this.dialogRef.close();
            }, error => {
              this.messageError = error.error;
              if (error.status === 0 || 500) {
                  this.messageError = 'Something wrong. Please try again';
              }
              this.showError = true;
              this.pending = false;
              console.log(error);
            });
  }
  openNewPass() {
        const dialogRef = this.matDialog.open( NewPassComponent );
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
  }
  isControlInvalid(controlName: string): boolean {
        const control = this.forgotPassForm.controls[controlName];
        const result = control.invalid && control.touched;
        return result;
  }

  private initForm() {
        this.forgotPassForm = this.fb.group({
          email: ['', [
            Validators.required,
            Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')
          ]
          ]
        });
  }
}
