import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
// import { AuthService } from '../../shared/services/auth.service';
// import { LogService } from '../../shared/services/log.service';
import { ActivatedRoute, Router} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LogService } from '../../services/log.service';
import { AppStore } from '../../store/app.store';
// import { AppStore } from '../../shared/store/app.store';

@Component({
  selector: 'app-new-pass',
  templateUrl: './new-pass.component.html',
  styleUrls: ['./new-pass.component.scss']
})
export class NewPassComponent implements OnInit  {
  newPassForm: FormGroup;
  chPass = {token: '', email: '', password: '', password_confirmation: ''};
  toto;

  constructor(
    public dialogRef: MatDialogRef<NewPassComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public matDialog: MatDialog,
    private fb: FormBuilder, private service: AuthService, 
    private log: LogService, private rt: Router, public store: AppStore) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.initForm();
}
onSubmit() {
  const controls = this.newPassForm.controls;
  if (this.newPassForm.invalid) {
    Object.keys(controls)
      .forEach(controlName => controls[controlName].markAsTouched());
    return;
  }
  /** TODO: Обработка данных формы */
      console.log(this.newPassForm);
      this.changePassword();
}

  changePassword() {
    this.toto =  JSON.parse(localStorage.getItem('changePass'));
    this.chPass.token = this.toto.token;
    this.chPass.email = this.toto.email;
    this.chPass.password = this.newPassForm.value.password;
    this.chPass.password_confirmation = this.newPassForm.value.password_confirmation;
    console.log(this.chPass);
    this.service.resetPassword(this.chPass)
      .subscribe(data => {
        localStorage.removeItem('changePass');
        this.chPass = {token: '', email: '', password: '', password_confirmation: ''};
        this.toto = {};
        localStorage.setItem('currentUser', JSON.stringify(data));
        this.store.saveUser(data);
        this.dialogRef.close();
        this.rt.navigate(['']);
      }, error => {
        console.log(error);
      });
}
  isControlInvalid(controlName: string): boolean {
    const control = this.newPassForm.controls[controlName];
    const result = control.invalid && control.touched;
    return result;
}
private initForm() {
  this.newPassForm = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
    ]
    ],
    password_confirmation: ['', [
        Validators.required,
        Validators.minLength(8),
    ]
    ]
  }, {validator: this.checkIfMatchingPasswords('password', 'password_confirmation')});
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

    subscribeStateUpdates = (): void => {
      this.store.state$.subscribe(state => {
        console.log(state);
      });
    }
  }
