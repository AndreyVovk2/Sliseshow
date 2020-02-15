import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppStore } from '../../store/app.store';
import { AuthService } from '../../services/auth.service';
// import { AppStore } from '../../shared/store/app.store';
// import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email-popup.component.html',
  styleUrls: ['./confirm-email-popup.component.scss']
})
export class ConfirmEmailPopupComponent implements OnInit {
  subscriptionUser: any;
  resendUser = {
    admin: 0,
    confirmed: 0,
    created_at: '',
    email: '',
    facebook_id: '',
    gender: '',
    id: 0,
    last_name: '',
    name: '',
    tariff_id: null,
    token: '',
    updated_at: '',
    used: 0,
};
  constructor(
    public dialogRef: MatDialogRef<ConfirmEmailPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public matDialog: MatDialog, public store: AppStore, private service: AuthService) {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    console.log(this.data);
    // console.log(this.data);
  }

  resend(): void {
    if (this.data.mail) {
      this.service.addSubscribers(this.data.mail)
      .subscribe(data => {
        console.log(data);
        this.dialogRef.close();
      }, error => {
        console.log(error);
      });
      return this.data;
    }
    if (localStorage.getItem('resendMail')) {
      this.resendUser.token = localStorage.getItem('resendMail');
      this.store.saveUser(this.resendUser);
      localStorage.setItem('currentUser', JSON.stringify(this.resendUser));
      this.service.resendMail()
      .subscribe(data => {
        console.log(data);
        this.store.removeUser();
        this.dialogRef.close();
      }, error => {
        console.log(error);
      });
    }
  }

  subscribeStateUpdates = (): void => {
    this.store.state$.subscribe(state => {
      console.log(state);
    });
  }

}
