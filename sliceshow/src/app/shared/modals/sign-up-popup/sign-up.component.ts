import { Component,  Inject, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SignInComponent } from '../sign-in-popup/sign-in.component';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ConfirmEmailPopupComponent } from '../confirm-email-popup/confirm-email-popup.component';
import { AuthService } from '../../services/auth.service';
import { FacebookAuthService } from '../../services/facebook.service';
// import { AuthService } from '../../shared/services/auth.service';
// import { FacebookAuthService } from '../../shared/services/facebook.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
    signUpForm: FormGroup;
    errorVar = false;
    show = '';
    visiabl = false;
    isChecked = true;

  constructor(public dialogRef: MatDialogRef<SignUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
     public matDialog: MatDialog, private rt: Router, private fb: FormBuilder,
     private service: AuthService, private authFB: FacebookAuthService) { }


    onNoClick(): void {
        this.dialogRef.close();
  }
    ngOnInit() {
        this.initForm();
  }
    logFB() {
      this.authFB.login();
  }
    onSubmit() {
        const controls = this.signUpForm.controls;
        if (this.signUpForm.invalid) {
          this.requireCheckbox();
          Object.keys(controls)
            .forEach(controlName => controls[controlName].markAsTouched());
          return;
        }
        /** TODO: Обработка данных формы */
        // if (this.signUpForm.value.password === this.signUpForm.value.retype_password ) {
//            console.log(this.signUpForm.value);
            console.log(this.signUpForm);
            this.createAcc();
        // }
  }
    createAcc() {
        this.service.register(this.signUpForm.value)
            .subscribe(data => {
                localStorage.setItem('resendMail', data.token);
                // console.log(data);
                this.openConfirm();
                this.dialogRef.close();
            }, error => {
              console.log(error);
              // console.log(error.error.error.email[0]);
              this.show = error.error.message.email[0];
              this.errorVar = true;
            });
  }
  requireCheckbox() {
    const checkBox = document.querySelector('#checkbox');
    const checkLabel = document.querySelector('#labla');
    if (checkBox.classList.contains('ng-invalid')) {
      console.log('fff');
      checkLabel.classList.add('invalLabel');
    } else if (checkBox.classList.contains('ng-valid')) {
      checkLabel.classList.remove('invalLabel');
    }
  }
    openConfirm() {
        const dialogRef = this.matDialog.open( ConfirmEmailPopupComponent );
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          localStorage.removeItem('resendMail');
          localStorage.removeItem('currentUser');
        });
  }
    openSignIn() {
        const dialogRef = this.matDialog.open( SignInComponent );
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
  }
    openTerms() {
      this.dialogRef.close();
      this.rt.navigate(['/terms-and-conditions']);
    }
    isControlInvalid(controlName: string): boolean {
        const control = this.signUpForm.controls[controlName];
        const result = control.invalid && control.touched;
        return result;
  }
    check() {
      console.log('dfd');
      this.visiabl = !this.visiabl;
    }
    // check2() {
    //     console.log('dfd');
    //     return this.visiabl2 = !this.visiabl2;
    // }


    private initForm() {
        this.signUpForm = this.fb.group({
          name: ['', [
            Validators.required,
            Validators.pattern(/^[a-z\u0590-\u05fe]+$/i),
            Validators.maxLength(20)
          ]
          ],
          last_name: ['', [
            Validators.required,
            Validators.pattern(/^[a-z\u0590-\u05fe]+$/i),
            Validators.maxLength(20)
          ]
          ],
          email: ['', [
            Validators.required,
            Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')
          ]
          ],
            password: ['', [
              Validators.required,
              Validators.minLength(8),
          ]
          ],
            retype_password: ['', [
              Validators.required,
              Validators.minLength(8),
          ]
          ],
            check: ['', [
            Validators.required
        ]
        ],
            subscribe: ['',
        ]
        }, {validator: this.checkIfMatchingPasswords('password', 'retype_password')});
  }


  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      const passwordInput = group.controls[passwordKey];
      const passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordConfirmationInput.value === '') {
        return passwordConfirmationInput.setErrors({notEquivalent: true});
      }
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({notEquivalent: true});
      } else {
          return passwordConfirmationInput.setErrors(null);
      }
    };
  }
}
