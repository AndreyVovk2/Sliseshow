import { Component, Inject, OnInit  } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router} from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { FacebookAuthService } from '../../services/facebook.service';
import { AppStore } from '../../store/app.store';
import { SignUpComponent } from '../sign-up-popup/sign-up.component';
import { ForgotPassComponent } from '../forgot-pass-popup/forgot-pass.component';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit  {
  public errorVar = false;
  public pending = false;
  signInForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<SignInComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public matDialog: MatDialog, private fb: FormBuilder,
    private service: AuthService, private authFB: FacebookAuthService, private rt: Router, public store: AppStore) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    this.initForm();
    this.subscribeStateUpdates();
  }
  logFB() {
    this.authFB.login();
}
  openSignUp() {
    const dialogRef = this.matDialog.open( SignUpComponent );
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
    });
  }
  forgotPass() {
    const dialogRef = this.matDialog.open( ForgotPassComponent );
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
    });
  }
  onSubmit() {
        const controls = this.signInForm.controls;
        if (this.signInForm.invalid) {
          Object.keys(controls)
            .forEach(controlName => controls[controlName].markAsTouched());
          return;
        }
        /** TODO: Обработка данных формы */
            this.signIn();
}
  signIn() {
      this.pending = true;
      this.service.login(this.signInForm.value)
            .subscribe(data => {
              localStorage.setItem('currentUser', JSON.stringify(data));
              this.store.saveUser(data);
              this.errorVar = false;
              this.pending = false;
              this.dialogRef.close();
              this.rt.navigate(['']);
            },
            error => {
              // console.log(error);
              this.pending = false;
              this.errorVar = true;
            }
          );
  }
  isControlInvalid(controlName: string): boolean {
        const control = this.signInForm.controls[controlName];
        const result = control.invalid && control.touched;
        return result;
  }

  private initForm() {
        this.signInForm = this.fb.group({
          email: ['', [
            Validators.required,
            Validators.email,
            // Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
            // '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'
            // ^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$
          ]
          ],
          password: ['', [
            Validators.required,
            Validators.minLength(8)
          ]
          ]
        });
  }

  subscribeStateUpdates = (): void => {
    this.store.state$.subscribe(state => {
      // console.log(state);
    });
  }
}
