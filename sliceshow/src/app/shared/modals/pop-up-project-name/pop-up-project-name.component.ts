import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
// import { ProjectService } from '../../shared/services/project.service';
import { Router} from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { AppStore } from '../../store/app.store';
// import { AppStore } from '../../shared/store/app.store';

@Component({
  selector: 'app-pop-up-project-name',
  templateUrl: 'pop-up-project-name.component.html',
  styleUrls: ['pop-up-project-name.component.scss']
})
export class PopUpProjectNameComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PopUpProjectNameComponent>, 
    public project: ProjectService,
    public rt: Router,
    public store: AppStore
  ) { }

  newProject = {
    // name: '',
    // animation_style: []
    name: '',
    templates: [],
    tariff: null
  };

  newProject1 = {
    name: '',
    templates: []
  };

  load = false;
  nameError = false;

  ngOnInit() {
    // console.log(this.data);
    console.log(this.store.state.basket);
  //   this.newProject.animation_style = this.store.state.basket.map(e => ({
  //     style: e.id, pics: e.select_pic
  //   })
  // );

    if (this.data && this.data.task === 'updateName') {
      this.updateProject();
      console.log(this.data);
    } else {
      this.newProject.templates = this.store.state.basket.map(e => (
        e.select_template_id)
      );

      this.getTariffId();
      console.log(this.newProject);
    }

    // this.newProject.templates = this.store.state.basket.map(e => (
    //   e.select_template_id)
    // );
    //
    // this.getTariffId();
    // console.log(this.newProject);
  }

  getTariffId () {
    let currentUser;
    if (localStorage.getItem('currentUser')) {
      currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.newProject.tariff = currentUser.tariff_id;
    }
  }

  onClose(name = ''): void {
    const newName = {name};
    this.dialogRef.close(newName);
  }

  setProjectPrice (id) {
    localStorage.setItem(String(id), String(this.store.state.basketTotalPrice));
  }

  selectFunc() {
    if (this.data && this.data.task === 'updateName') {
      this.updateProject();
    } else {
      this.createProject();
    }
  }


  createProject() {
    console.log(this.newProject.name !== '');
    if (this.newProject.name) {
      this.nameError = false;
      this.load = true;
      console.log(this.newProject);
      this.project.createProject(this.newProject)
      .subscribe(data => {
        console.log(data);
        this.setProjectPrice(data.id);
        this.onClose();
        this.rt.navigate(['/editing-system/' + btoa(data.id)] );
      }, error => {
        console.log(error);
      });
    } else if (this.newProject.name === '') {
      this.nameError = true;
    }
    

  }

  updateProject() {
    console.log('updateProject');
    let updateData;
    if (this.newProject.name) {
      updateData = { name: this.newProject.name, id: this.data.projectId };
      this.project.updateProject(updateData).subscribe( (result) => {
        console.log(result);
        this.onClose(result.name);
      }, (error) => {
        console.log(error);
      });
      // updateData = {this.newProject.name, this.editingStore.state.project.id};
    } else {

    }

  }

}
