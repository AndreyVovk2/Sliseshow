import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { AppStore } from '../../shared/store/app.store';
import { MatSnackBar } from '@angular/material';
import { AdminStore } from '../../admin/adminChange/admin.store';
// import { AdminStore } from '../../components/adminChange/admin.store';
// import {MatSnackBarModule} from '@angular/material/snack-bar';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  profileForm: FormGroup;
  gender = '';

  constructor(
    private fb: FormBuilder, 
    private service: AuthService,
    public store: AppStore, 
    public snackBar: MatSnackBar,
    private adminStore: AdminStore
  ) {
  }

  ngOnInit() {
      this.initForm();
      this.adminStore.changeMetaKey('withoutMeta');
      console.log(this.profileForm);
      this.setGenderStatus();
  }
  
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
  setGenderStatus() {
    if (this.store.state.authCredentials) {
      this.gender = this.store.state.authCredentials.gender;
    } else {
      this.gender = 'male';
    }
  }

  onSubmit() {
    const controls = this.profileForm.controls;
    if (this.profileForm.invalid) {
      Object.keys(controls)
        .forEach(controlName => controls[controlName].markAsTouched());
      return;
    }
    /** TODO: Обработка данных формы */
    this.changeProfile();
  }

  changeProfile() {
    this.profileForm.value.gender = this.gender;
    this.service.changeUser(this.profileForm.value)
    .subscribe(data => {
      this.store.removeUser();
      this.store.saveUser(data);
      localStorage.setItem('currentUser', JSON.stringify(data));
      console.log(data);
      this.openSnackBar('profile change successful', 'Ok');
    }, error => {
      console.log(error);
      this.openSnackBar('Response error', 'Cancel');

    });
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.profileForm.controls[controlName];
    const result = control.invalid && control.touched;
    return result;
  }

    private initForm() {
        this.profileForm = this.fb.group({
          name: ['', [
            Validators.required,
            Validators.pattern(/[A-Za-zА-Яа-яЁё]/),
            Validators.maxLength(20),
          ]
          ],
          last_name: ['', [
            Validators.required,
            Validators.pattern(/[A-Za-zА-Яа-яЁё]/),
            Validators.maxLength(20)
          ]
          ],
          email: ['', [
            Validators.required,
            Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')
          ]
          ],
          old_password: ['', [
            // Validators.required,
            Validators.minLength(8)
          ]
          ],
          new_password: ['', [
            // Validators.required,
            Validators.minLength(8),
          ]
          ],
          confirm_password: ['', [
            // Validators.required,
            Validators.minLength(8),
          ]
          ],
          gender: [this.gender]
        }, {validator: this.checkIfMatchingPasswords('new_password', 'confirm_password', 'old_password')});
  }

subscribeStateUpdates = (): void => {
  this.store.state$.subscribe(state => {
    console.log(state);
  });
}

changeGender(sex) {
  this.gender = sex;
}

checkIfMatchingPasswords(
  passwordKey: string,
  passwordConfirmationKey: string,
  passwordOldKey: string) {
  return (group: FormGroup) => {
    const passwordInput = group.controls[passwordKey];
    const passwordConfirmationInput = group.controls[passwordConfirmationKey];
    const passwordOldInput = group.controls[passwordOldKey];
    if (passwordInput.value !== '' && passwordOldInput.value === '') {
      return passwordOldInput.setErrors({notEquivalent: true});
    } else if (passwordInput.value !== passwordConfirmationInput.value) {
      return passwordConfirmationInput.setErrors({notEquivalent: true});
  } else {
        return passwordConfirmationInput.setErrors(null), passwordOldInput.setErrors(null);
  }
};
}
}
