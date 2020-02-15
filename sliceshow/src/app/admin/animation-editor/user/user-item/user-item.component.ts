import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { AdminStore } from '../../admin.store';
import { AdminService } from '../../../../shared/services/admin.service'; 
import { COMMON_URL, api } from '../../../../shared/services/common.url';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NotifierService } from 'angular-notifier';
import { AdminStore } from '../../../adminChange/admin.store';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss']
})
export class UserItemComponent implements OnInit {

  newUser = {
    id: '',
    facebook_id: '',
    name: '',
    password: '',
    last_name: '',
    email: '',
    confirm_token: '',
    gender: 'Male',
    confirmed: false,
    admin: 0,
    tariff_id: '',
    used: '',
    created_at: '',
    updated_at: ''
};
  sendBody = {
    title: '',
    massage: ''
  };
  

  adminRole = {admin: false};

  constructor(
    public dialogRef: MatDialogRef<UserItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public adminStore: AdminStore,
    public service: AdminService,
    private readonly notifier: NotifierService
  ) { }

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '400px',
    width: '700px',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    uploadUrl: `${api}subscribers/add_image`,
    translate: 'no',
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ]
  };

  ngOnInit() {
  }

  closeModal() {
    this.dialogRef.close();
  }

  deleteUser() {
    const id = this.adminStore.state.editUser.id;
    this.service.deleteUser(id)
    .subscribe(data => {
      console.log(data);
      this.adminStore.deleteUser(id);
      this.notifier.notify('success', 'User deleted successfully.');
      this.closeModal();
    }, error => {
      console.log(error);
      this.notifier.notify('error', 'Deleting error');
    });
  }

  updateUser() {
    const id = this.adminStore.state.editUser.id;
    const user = this.adminStore.state.editUser;
    console.log(this.adminStore.state.editUser);
    this.service.updateUser(user, id)
    .subscribe(data => {
      this.notifier.notify('success', 'User updated successfully.');
      this.closeModal();
    }, error => {
      console.log(error);
      this.notifier.notify('error', 'Updating error');
    });
  }

  createUser() {
    console.log(this.newUser);
    this.service.createUser(this.newUser)
    .subscribe(data => {
      this.adminStore.saveAllUsers(data);
      this.notifier.notify('success', 'User created successfully.');
      console.log(data);
      this.closeModal();
    }, error => {
      console.log(error);
      this.notifier.notify('error', 'Creating error');
    });
  }

  changeAdminRights() {
    const id = this.adminStore.state.editUser.id;
    if (this.adminStore.state.editUser.admin === 0) {
      this.adminRole.admin = true;
    } else if (this.adminStore.state.editUser.admin === 1) {
      this.adminRole.admin = false;
    }
    this.service.makeAdmin(id, this.adminRole)
    .subscribe(data => {
      this.adminStore.updateUserRole(id);
      this.closeModal();
    }, error => {
      console.log(error);
    });

  }

  sendMail() {
    this.service.sendMail(this.sendBody)
    .subscribe(data => {
      console.log(data);
      this.closeModal();
    }, error => {
      console.log(error);
    });
  }

  subscribeStateUpdates = (): void => {
    this.adminStore.state$.subscribe(state => {
      console.log(state);
    });
  }

}
