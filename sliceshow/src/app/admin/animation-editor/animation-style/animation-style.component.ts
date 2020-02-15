import {Component, OnInit, Input, EventEmitter, Output, OnDestroy, ChangeDetectorRef} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import {FormGroup, FormControl, Validators, FormArray} from '@angular/forms';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {AnimationService} from '../animation.service';
import {SubcategoriesPopupComponent} from '../subcategories-popup/subcategories-popup.component';
import {TagsPopupComponent} from '../tags-popup/tags-popup.component';
import {ScreensPopupComponent} from '../screens-popup/screens-popup.component';
import {SocketService} from '../../../editor/socket-service';
import {Subscription} from 'rxjs/Subscription';
import {EditingStore} from '../../../editor/store/editing.store';
import {AdminStore} from '../../adminChange/admin.store';


@Component({
  selector: 'animation-style',
  templateUrl: './animation-style.component.html',
  styleUrls: ['./animation-style.component.scss']
})
export class AnimationStyleComponent implements OnInit, OnDestroy {

  styleId: number;
  private test = 0;
  private subscriber_1;
  private subscriber_2;
  public animationForm: FormGroup;
  private emptyCheck = false;
  // uploadFiles = { project: '', image: '', video: '', listOfSubcategory: [], tags: []};
  uploadFiles = {project: '', video: '', preview_video: ''};
  previewVideos = [];
  public toggleLog = false;
  private devPath = 'http://192.168.0.173:9000';
  public auditStatus = 'unverify';
  private log = '';
  private subscriber_audit1: Subscription;
  private subscriber_audit2: Subscription;
  private newArr = [];
  public auditPath: string;
  public auditScreens = [];
  public templatesArr = [];
  public formArr = [];
  public lastIndex: number;
  public link: string;
  public animationId: number;
  public newTemplatesCheck: boolean;

  public format = [
    {'composition': '', 'quality': '240p'},
    {'composition': '', 'quality': '720p'},
    {'composition': '', 'quality': '1080p'}
  ];


  constructor(
    private route: ActivatedRoute,
    private service: AnimationService,
    private router: Router,
    private socket: SocketService,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    public editingStore: EditingStore,
    public adminStore: AdminStore) {
  }

  ngOnInit() {
    this.getIdFromLink();

    // this.initEmptyForm();
    // this.getTemplatesById();
    // this.getParam();
    // this.getScreens();
  }

  getIdFromLink() {
    this.link = this.router.url;
    this.lastIndex = this.router.url.lastIndexOf('/');
    this.animationId = +this.link.substr(this.lastIndex + 1);
    console.log(this.animationId);
    this.getTemplatesById();
  }

  generateFormItem() {
    const formItem = new FormGroup({
      'duration': new FormControl(null, Validators.compose([
        Validators.required,
        Validators.min(0)
      ])),
      'pics': new FormControl(null, Validators.compose([
        Validators.required,
        Validators.min(0)
      ])),
      'format': new FormArray([])
    });
    for (let q = 0; q < this.format.length; q++) {
      (<FormArray>formItem.get('format')).push(this.setFormatToForm(q));
    }
    return formItem;
  }


  initEmptyForm() {
    this.formArr.push(this.generateFormItem());
    // this.formArr[0] = new FormGroup({
    //   'duration': new FormControl(null, Validators.compose([
    //     Validators.required,
    //     Validators.min(0)
    //   ])),
    //   'pics': new FormControl(null, Validators.compose([
    //     Validators.required,
    //     Validators.min(0)
    //   ])),
    //   'format': new FormArray([])
    // });
    // for (let q = 0; q < this.format.length; q ++) {
    //   (<FormArray>this.formArr[0].get('format')).push(this.setFormatToForm(q));
    // }
  }

  initForm() {
    if (this.templatesArr.length > 0) {
      this.newTemplatesCheck = false;
      this.initFullForm();
    } else {
      this.newTemplatesCheck = true;
      this.initEmptyForm();
    }
  }

  initFullForm() {
    console.log(this.templatesArr);
    for (let i = 0; i < this.templatesArr.length; i++) {
      this.formArr.push(this.generateFormItem());
      this.formArr[i].patchValue(this.templatesArr[i]);
    }
  }

  addFormItem() {
    this.formArr.push(this.generateFormItem());
    this.templatesArr.push(this.generateFormItem().value);
    this.templatesArr[this.templatesArr.length - 1].created = true;
    console.log(this.templatesArr[this.templatesArr.length - 1]);
  }


  setFormatToForm(i) {
    const controlEmpty = new FormGroup({
      'composition': new FormControl(this.format[i].composition, Validators.compose([
        Validators.required,
        Validators.maxLength(100)
      ])),
      'quality': new FormControl(this.format[i].quality, Validators.required)
    });
    return controlEmpty;
  }


  // getParam() {
  //   this.subscriber_1 = this.route.queryParams.subscribe(query => {
  //     if ('creating' in query) {
  //       this.initEmptyForm();
  //     } else {
  //       this.getStyleById();
  //     }
  // });
  // }


  updateForm() {
    if (this.templatesArr.length > 0) {
      this.newTemplatesCheck = false;
      // this.initForm();
      for (let i = 0; i < this.templatesArr.length; i++) {
        this.formArr[i].patchValue(this.templatesArr[i]);
      }
    } else {
      this.newTemplatesCheck = true;
    }
  }

  getStyleById() {
    this.subscriber_1 = this.route.params
      .subscribe(param => {
        console.log(param);
        this.styleId = +param['id'];
        this.getStyle();
      });
  }

  getScreens() {
    this.service.getStyleScreens(this.styleId)
      .subscribe(data => {
        this.auditScreens = data.screens;
        console.log(this.auditScreens);
      });
  }


  getStyle() {
    this.service.getOneStyle(this.styleId)
      .subscribe(data => {
        console.log(data);
        this.auditPath = `${data.ae_file_path}/${data.ae_file_name}`;
        // this.editStyle = { 'name': data.name, 'likes': data.likes,
        // 'trending': data.trending, 'includeVideo': data.including_video };
        //
        // this.uploadFiles.image = data.preview_image;
        // this.uploadFiles.video = data.preview_video;
        // this.uploadFiles.listOfSubcategory = data.sub_categories;
        // this.uploadFiles.tags = data.tags.map(v => v.id);
        // this.animationForm.patchValue(this.editStyle);

        // if (data.pics) {
        //   console.log(data.pics);
        //   data.pics.forEach(i => {
        //     const control = new FormGroup({
        //       'amount': new FormControl(i.amount, Validators.required),
        //       'duration': new FormControl(i.duration, Validators.required)
        //     });
        //     (<FormArray>this.animationForm.get('pics')).push(control);
        //   });
        // }

        if (data.format) {
          data.format.forEach(i => {
            const control = new FormGroup({
              'composition': new FormControl(i.composition, Validators.required),
              'quality': new FormControl(i.quality, Validators.required)
            });
            (<FormArray>this.animationForm.get('format')).push(control);
          });
        } else {
          this.format.forEach(i => {
            const defFormat = new FormGroup({
              'composition': new FormControl(i.composition, Validators.required),
              'quality': new FormControl(i.quality, Validators.required)
            });
            (<FormArray>this.animationForm.get('format')).push(defFormat);
          });
        }

      }, error => {
        this.router.navigate(['error']);
      });
    console.log(this.uploadFiles);
  }


  addMedia() {
    const control = new FormGroup({
      'amount': new FormControl(null, Validators.required),
      'duration': new FormControl(null, Validators.required)
    });
    (<FormArray>this.animationForm.get('pics')).push(control);
  }

  addFormat() {
    const control = new FormGroup({
      'composition': new FormControl(null, Validators.required),
      'quality': new FormControl(null, Validators.required)
    });
    (<FormArray>this.animationForm.get('format')).push(control);
  }

  deleteMedia(i) {
    (<FormArray>this.animationForm.get('pics')).removeAt(i);
  }

  deleteFormat(i) {
    (<FormArray>this.animationForm.get('format')).removeAt(i);
  }

  onSubmit() {
    if (this.styleId && this.animationForm.valid) {
      this.clearStringValues();
      this.updateStyle();
    } else if (!this.styleId) {
      this.emptyCheck = true;
      if (this.allFilesValidate() && this.animationForm.valid) {
        this.createStyle();
      }
    }
  }

  getAuditData() {
    // await this.service.getStyleScreens(this.styleId).subscribe(data => this.auditScreens = data);
    // this.auditScreens = [];
    this.auditScreens.forEach(v => {
      if (v.medias) {
        this.newArr = [...this.newArr, ...v.medias];
      }
      if (v.text) {
        this.newArr = [...this.newArr, ...v.text];
      }
    });
    this.newArr = this.newArr.map(v => {
      return {layer: v.layer, composition: `${v.composition}c`};
    });
    console.log(this.newArr);
  }

  auditDate() {
    this.getAuditData();
    this.auditStatus = 'verifying on progress';
    const finalDate = {path: this.auditPath, elements: this.newArr};
    console.log(finalDate);
    this.socket.sendEvent('audit-start', finalDate);
  }

  initSocket() {
    this.socket.initSocket(this.devPath);


    setTimeout(this.auditDate(), 0);

    this.subscriber_audit1 = this.socket.onEvent('audit-end').subscribe(data => {
      this.auditStatus = 'audit finish';
      this.log = data;
      console.log(data);
    });

    this.subscriber_audit2 = this.socket.onEvent('audit-error').subscribe(data => {
      this.auditStatus = 'audit error';
      this.log = data;
      console.log(data);
    });

  }

  showLog() {
    this.toggleLog = !this.toggleLog;
  }

  show(event, num) {
    console.log(event.target.files);
    this.uploadFile(event.target.files[0], num);
  }


  allFilesValidate() {
    const v = this.uploadFiles;
    if (!this.styleId) {
      // return (v.image && v.video && v.project && v.listOfSubcategory[0]);
      return (v.video && v.project);
    }
  }

  clearStringValues() {
    if (this.styleId) {
      for (const prop in this.uploadFiles) {
        if (typeof this.uploadFiles[prop] === 'string') {
          delete this.uploadFiles[prop];
        }
      }
    }
  }

  createStyle() {
    const newObj = {...this.uploadFiles, ...this.animationForm.value};
    console.log(newObj);
    this.service.createNewStyles(newObj)
      .then(data => {
        console.log(data);
      }, error => {
        console.log(error);
      });
  }

  updateStyle() {
    // const newObj = {...this.uploadFiles, ...this.animationForm.value};
    const newObj = {...this.animationForm.value};
    console.log(newObj, this.styleId);
    this.service.updateStyle(newObj, this.styleId)
      .then(data => {
        console.log(data);
      }, error => {
        console.log(error);
      });
  }


  uploadFile(file, num) {
    console.log(num);
    switch (num) {
      case 1:
        this.uploadFiles.project = file;
        break;
      // case 2:
      //   this.uploadFiles.image = file;
      //   break;
      case 3:
        this.uploadFiles.video = file;
        break;
    }

  }

  returnForm() {
    return (<FormArray>this.animationForm.get('pics')).controls;
  }

  returnFormatForm() {

    if (this.formArr.length > 0) {
      for (let i = 0; i < this.formArr.length; i++) {
        return (<FormArray>this.formArr[i].get('format')).controls;
      }
    }
  }

  checkTemplate(index) {

    if (this.templatesArr[index]) {
      return true;
    } else {
      return false;
    }

  }


  // checkValidation(index) { return this.formArr[index].valid; }
  checkValidation(index) {
    return this.formArr[index].valid && !this.allButtonsValid();
  }

  isNew() {
    return this.styleId ? 'Update' : 'Create';
  }

  isString(val) {
    return typeof val === 'string';
  }

  inputFileValidate(file) {
    return (!file && this.emptyCheck);
  }

  // subcategoryValidate() { return (this.emptyCheck &&  !this.uploadFiles.listOfSubcategory[0]); }


  // openSubCatPopup() {
  //   this.uploadFiles.listOfSubcategory.map(e => e.id );
  //       const dialogRef = this.dialog.open(SubcategoriesPopupComponent, {
  //         data: {list : this.uploadFiles.listOfSubcategory},
  //       });
  // }
  //
  // openTags() {
  //       const dialogRef = this.dialog.open(TagsPopupComponent, {
  //         data: {list : this.uploadFiles.tags},
  //       });
  // }

  // WORK WITH TEMPLATES

  getTemplatesById() {
    this.templatesArr.length = 0;
    this.formArr.length = 0;
    this.service.getTemplatesRequest(this.animationId).subscribe((result) => {
      this.templatesArr = result;
      console.log(this.templatesArr);
      // this.setUploadFiles();
      this.initForm();
    }, (error) => {
      this.initEmptyForm();
      console.log(error);
    });
  }

  createSingleTemplate(index) {
    const obj = {...this.uploadFiles, ...this.formArr[index].value};
    // console.log(this.uploadFiles);
    console.log(obj);
    this.service.createTemplateFormData(this.animationId, obj).then((result) => {
      console.log(result);
      this.editingStore.state.uploadProgress = 0;
      this.uploadFiles = {project: '', video: '', preview_video: ''};
      this.getTemplatesById();
    }, (error) => {
      console.log(error);
    });

    // this.service.createTemplate(this.animationId, obj).subscribe( (result) => {
    //   // this.templatesArr[index].created = false;
    //   this.getTemplatesById();
    // //  result
    // }, (error) => {
    //   console.warn(error);
    // });
  }

  updateTemplate(index) {
    // console.log(this.formArr[index].value);
    // console.log(this.templatesArr[index]);
    console.log(this.formArr[index].value);
    const obj = {...this.uploadFiles, ...this.formArr[index].value};
    console.log(obj);

    console.log(this.uploadFiles);
    this.service.updateTemplateFormData(this.animationId, this.templatesArr[index].id, obj).then((result) => {
      // console.log(result);
      this.getTemplatesById();
    }, (error) => {
      console.log(error);
    });
    // this.service.updateTemplate(this.animationId, this.templatesArr[index].id, this.formArr[index].value).subscribe( (result) => {
    //   console.log(result);
    // }, (error) => {
    //   console.log(error);
    // });
  }

  cleanData(q) {
    this.formArr.splice(q, 1);
    this.templatesArr.splice(q, 1);
    // this.previewVideos.splice(q, 1);
    this.uploadFiles = {project: '', video: '', preview_video: ''};
  }

  deleteTemplate(q) {
    if (this.templatesArr[q].created === true) {
      console.warn('FIRST STEP');
      // this.formArr.splice(q, 1);
      // this.templatesArr.splice(q, 1);
      // this.
      // this.uploadFiles = {project: '', video: '', preview_video: ''};
      this.cleanData(q);
    } else {
      console.warn('SECOND STEP');
      this.service.deleteTemplate(this.animationId, this.templatesArr[q].id).subscribe((result) => {
        //  result;
        //   this.formArr.splice(q, 1);
        //   this.templatesArr.splice(q, 1);
        //   this.uploadFiles = {project: '', video: '', preview_video: ''};
        //   this.deleteTemplate(q);
        //   this.cleanData(q);
        this.getTemplatesById();

      }, (error) => {
        //  error
      });
    }

    console.log(this.formArr);
    console.log(this.templatesArr);
  }

  resetFormArr() {
    this.formArr.forEach(form => {
      form.reset();
    });
  }

  allButtonsValid() {
    if (this.adminStore.state) {
      if (this.adminStore.state.uploadProgress !== 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  ngOnDestroy() {
    if (this.subscriber_1) {
      this.subscriber_1.unsubscribe();
    }
    if (this.subscriber_2) {
      this.subscriber_2.unsubscribe();
    }
    this.resetFormArr();

    // this.animationForm.reset();
  }

}
