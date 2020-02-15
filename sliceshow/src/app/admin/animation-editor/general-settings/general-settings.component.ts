import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormGroup, FormControl, Validators, FormArray} from '@angular/forms';
import {AnimationService} from '../animation.service';
import {MatDialog} from '@angular/material';
import {SubcategoriesPopupComponent} from '../subcategories-popup/subcategories-popup.component';
import {TagsPopupComponent} from '../tags-popup/tags-popup.component';
import {SocketService} from '../../../editor/socket-service';
import {Subscription} from 'rxjs/Subscription';


@Component({
  selector: 'general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss']
})
export class GeneralSettingsComponent implements OnInit, OnDestroy {
  editStyle: any;
  styleId: number;
  private subscriber_1;
  private subscriber_2;
  public animationForm: FormGroup;
  private emptyCheck = false;
  public auditPath: string;
  public auditScreens = [];
  // uploadFiles = {project: '', image: '', video: '', listOfSubcategory: [], tags: []};
  uploadFiles = {project: '', image: '', listOfSubcategory: [], tags: []};

  constructor(private route: ActivatedRoute,
              private service: AnimationService,
              private router: Router,
              private socket: SocketService,
              public dialog: MatDialog) {

  }


  ngOnInit() {
    this.initForm();
    this.getParam();
    // this.getStyleByid();
    // this.getScreens();
  }

  ngOnDestroy() {
    this.resetForm();
  }

  resetForm() {
    this.animationForm.reset();
  }


  getParam() {
    this.subscriber_1 = this.route.queryParams.subscribe(query => {
      if ('creating' in query) {
        // this.initEmptyForm();
        // this.getStyleByid();
      } else {
        this.getStyleByid();
      }
    });
  }

  initForm() {
    this.animationForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'trending': new FormControl(null, Validators.required),
      'likes': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required),
      'including_video': new FormControl(null),
      // 'pics': new FormArray([]),
      // 'format': new FormArray([])

    });
  }



  getStyleByid() {
    this.subscriber_1 = this.route.params
        .subscribe(param => {
          // console.log(param);
          this.styleId = +param['id'];
          // console.log(this.styleId);
          this.getStyle();
        });
  }

  getStyle() {
    this.service.getOneStyle(this.styleId)
        .subscribe(data => {
          console.log(data);
          this.auditPath = `${data.ae_file_path}/${data.ae_file_name}`;
          this.editStyle = { 'name': data.name, 'likes': data.likes,
            'trending': data.trending, 'including_video': data.including_video, 'description': data.description};

          this.uploadFiles.image = data.preview_image;
          // this.uploadFiles.video = data.preview_video;
          if (data.sub_categories) {
            console.log(data.sub_categories);
            this.uploadFiles.listOfSubcategory = data.sub_categories;
          } else {

          }

          this.uploadFiles.tags = data.tags.map(v => v.id);
          this.animationForm.patchValue(this.editStyle);
          console.log(this.uploadFiles);

          // data.pics.forEach(i => {
          //   const control = new FormGroup({
          //     'amount': new FormControl(i.amount, Validators.required),
          //     'duration': new FormControl(i.duration, Validators.required)
          //   });
          //   (<FormArray>this.animationForm.get('pics')).push(control);
          // });
          //
          // if (data.format) {
          //   data.format.forEach(i => {
          //     const control = new FormGroup({
          //       'composition': new FormControl(i.composition, Validators.required),
          //       'quality': new FormControl(i.quality, Validators.required)
          //     });
          //     (<FormArray>this.animationForm.get('format')).push(control);
          //   });
          // }

        }, error => {
          this.router.navigate(['error']);
        });
  }

  getScreens() {
    this.service.getStyleScreens(this.styleId)
        .subscribe(data => {
          console.log(data);
          this.auditScreens = data.screens;
          console.log(this.auditScreens);
        });
  }

  show(event, num) {
    this.uploadFile(event.target.files[0], num);
  }

  uploadFile(file, num) {
    switch (num) {
      case 1:
        this.uploadFiles.project = file;
        break;
      case 2:
        this.uploadFiles.image = file;
        break;
      // case 3:
      //   this.uploadFiles.video = file;
      //   break;
    }
  }

  openTags() {
    const dialogRef = this.dialog.open(TagsPopupComponent, {
      data: {list : this.uploadFiles.tags},
    });
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
          this.resetForm();
        }, error => {
          console.log(error);
        });
  }

  updateStyle() {
    console.log(this.uploadFiles);
    const newObj = {...this.uploadFiles, ...this.animationForm.value};
    console.log(newObj, this.styleId);
    this.service.updateStyle(newObj, this.styleId)
        .then(data => {
          console.log(data);
          this.clearStringValues();
        }, error => {
          console.log(error);
        });
  }

  allFilesValidate() {
    const v = this.uploadFiles;
    console.log(this.uploadFiles);
    if (!this.styleId) {
      return (v.image && v.listOfSubcategory[0]);
      // return (v.image && v.video && v.project && v.listOfSubcategory[0]);
    }
  }

  onSubmit() {
    console.log(this.animationForm);
    if (this.styleId && this.animationForm.valid) {

      this.clearStringValues();
      this.updateStyle();
    } else if (!this.styleId) {
      this.emptyCheck = true;
      if (this.allFilesValidate() && this.animationForm.valid) {
        this.createStyle();
      }
    } else {

    }
  }


  inputFileValidate(file) { return (!file && this.emptyCheck); }
  isString(val) { return typeof val === 'string'; }
  subcategoryValidate() { return (this.emptyCheck &&  !this.uploadFiles.listOfSubcategory[0]); }
  isNew() { return this.styleId ? 'Update' : 'Create'; }

  openSubCatPopup() {
    this.uploadFiles.listOfSubcategory.map(e => e.id );
    const dialogRef = this.dialog.open(SubcategoriesPopupComponent, {
      data: {list : this.uploadFiles.listOfSubcategory},
    });
  }




}
