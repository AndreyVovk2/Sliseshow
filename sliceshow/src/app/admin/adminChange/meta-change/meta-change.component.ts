import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Meta } from '@angular/platform-browser';
import { AdminService } from '../../../shared/services/admin.service';
import { TranslateService } from '@ngx-translate/core';
import { AdminStore } from '../admin.store';

@Component({
  selector: 'app-meta-change',
  templateUrl: './meta-change.component.html',
  styleUrls: ['./meta-change.component.scss']
})
export class MetaChangeComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MetaChangeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private meta: Meta,
    private adminService: AdminService,
    private translate: TranslateService,
    private adminStore: AdminStore
  ) { }

  newMeta = {name: '', content: ''};
  showEditor = false;
  editState = false;
  updateMetas;
  sendMetas = [];

  ngOnInit() {
    this.showAllMeta();
  }

  openEditor() {
    this.newMeta.name = '';
    this.newMeta.content = '';
    this.showEditor = true;
    this.editState = false;
  }

  addMeta() {
    this.meta.addTag(this.newMeta);
    this.showAllMeta();
    this.showEditor = false;
  }

  updateMeta() {
    this.meta.updateTag(this.newMeta);
    this.showAllMeta();
    this.showEditor = false;
  }

  editMeta(meta) {
    this.editState = true;
    this.newMeta.name = meta.name;
    this.newMeta.content = meta.content;
    this.showEditor = true;
  }

  deleteMeta(name) {
    console.log(name);
    this.meta.removeTag('name = ' + name);
    this.showAllMeta();
  }

  showAllMeta() {
    const metas = this.meta.getTags('name');
    this.sendMetas = [];
    metas.forEach(elem => {
      const currMeta = {name: elem.name, content: elem.content};
      this.sendMetas.push(currMeta);
    });
  }

  updateChanges() {
    // console.log(this.sendMetas);
    console.log(this.adminStore.state.currentLang);
    if ( this.adminStore.state.currentLang === 'en') {
      this.updateMetas = {
        key: this.adminStore.state.metaKey,
        values: {
          en : this.sendMetas
        }
      };
    } else if (this.adminStore.state.currentLang === 'he') {
      this.updateMetas = {
        key: this.adminStore.state.metaKey,
        values: {
          he : this.sendMetas
        }
      };
    }
    

    this.adminService.updateTranslate(this.updateMetas)
    .subscribe((data) => {
        this.dialogRef.close();
      });
  }


}
