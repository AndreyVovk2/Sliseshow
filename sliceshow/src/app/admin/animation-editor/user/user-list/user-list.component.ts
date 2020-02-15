import { Component, OnInit } from '@angular/core';
// import { AdminStore } from '../admin.store';
import { AdminService } from '../../../../shared/services/admin.service'; 
import { UserItemComponent } from '../user-item/user-item.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddSubscriberPopupComponent } from '../../../add-subscriber-popup/add-subscriber-popup.component';
import { NotifierService } from 'angular-notifier';
import { AdminStore } from '../../../adminChange/admin.store';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  toggleState = {
    checked: false,
    labelPosition: 'after',
    label: 'Show subscriber list'
  };
  allSubscribers = [];
  constructor(
    public adminStore: AdminStore,
    public service: AdminService,
    public matDialog: MatDialog,

  ) { }

  ngOnInit() {
    if (this.adminStore.state.userList.length === 0) {
    this.service.getUsers()
    .subscribe(data => {
      console.log(data);
      // this.userList = data;
      data.forEach(v => {
        this.adminStore.saveAllUsers(v);
      });
    }, error => {
      console.log(error);
    });
  }
  }

  slide(event) {
    console.log(event);
    console.log(this.toggleState);
    if (event.checked === true) {
      this.toggleState = {
        checked: true,
        labelPosition: 'before',
        label: 'Show user list'
      };
      this.showSubscibers();
    } else {
      this.toggleState = {
        checked: false,
        labelPosition: 'after',
        label: 'Show subscriber list'
      };
    }
  }

  showSubscibers() {
    this.service.getAllSubscribers()
    .subscribe(data => {
      console.log(data);
      this.allSubscribers = data;
    });
  }

  openAddSubscriberPopup() {
    const dialogRef = this.matDialog.open(  AddSubscriberPopupComponent );
    dialogRef.afterClosed().subscribe(result => {
      this.showSubscibers();
      console.log('The dialog was closed');
    });
}

  deleteSubscriber(subscriber) {
    this.service.deleteSubscriber(subscriber.id)
    .subscribe(data => {
      console.log(data);
      this.allSubscribers = this.allSubscribers.filter(s => s.id !== subscriber.id);
    });
  }

  addSubscriber() {

  }

  editUser(user) {
    this.adminStore.saveUserEdit(user);
    this.adminStore.changeUserState(0);
    this.openPopup();
  }

  deleteUser(user) {
    this.adminStore.saveUserEdit(user);
    this.adminStore.changeUserState(1);
    this.openPopup();
  }

  addUser() {
    this.adminStore.changeUserState(2);
    this.openPopup();
    console.log('start creating...');
  }

  addAdmin(user) {
    this.adminStore.saveUserEdit(user);
    this.adminStore.changeUserState(3);
    this.openPopup();
  }

  delAdmin(user) {
    this.adminStore.saveUserEdit(user);
    this.adminStore.changeUserState(4);
    this.openPopup();
  }

  openModalMail() {
    this.adminStore.changeUserState(5);
    this.openPopup();
  }

  openPopup() {
    const dialogRef = this.matDialog.open( UserItemComponent );
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
