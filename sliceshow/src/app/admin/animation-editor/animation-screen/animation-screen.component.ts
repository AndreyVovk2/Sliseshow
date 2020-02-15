import {Component, OnInit, OnDestroy} from '@angular/core';
// import { AnimationService } from '../../../shared/services/animation.service';
import {Router, ActivatedRoute} from '@angular/router';
import {FormGroup, FormControl, Validators, FormArray} from '@angular/forms';
import {NotifierService} from 'angular-notifier';
import {AnimationService} from '../animation.service';
import {SocketService} from '../../../editor/socket-service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'animation-screen',
  templateUrl: './animation-screen.component.html',
  styleUrls: ['./animation-screen.component.scss']
})
export class AnimationScreenComponent implements OnInit, OnDestroy {
  public screenForm: FormGroup;
  public allScreens = [];
  public currentScreen;
  public currentScreenId: number;
  public currentTemplateId: number;
  public image;
  public templatesArr = [];
  public screensCount: number;
  private subscriber_1;
  private subscriber_audit1: Subscription;
  private subscriber_audit2: Subscription;
  private styleId: number;
  private emptyCheck = false;
  private currentTemplate = {'pics': 0, 'duration': 0};


  constructor(
    private animationService: AnimationService,
    private rt: Router,
    private route: ActivatedRoute,
    private readonly notifier: NotifierService,
    private socket: SocketService
  ) {
  }

  ngOnInit() {
    this.getStyleByid();
    this.initForm();
  }

  getStyleByid() {
    this.subscriber_1 = this.route.params
      .subscribe(param => {
        console.log(param);
        this.styleId = +param['id'];
        // this.getAllScreen(this.styleId);
        // this.getStyle(this.styleId);
      });
    this.getTemplatesById();
  }

  getTemplatesById() {
    this.animationService.getTemplatesRequest(this.styleId).subscribe((result) => {
      console.log(result);
      if (result.length === 0) {
        this.templatesArr = [];
      } else {
        this.templatesArr = result;
        this.currentTemplate = this.templatesArr[0];
        this.initForm();
        console.log(this.currentTemplate);
        this.initTemplateId(this.templatesArr[0]);
        // this.initTemplatesScreen(this.templatesArr[0]);
      }

    }, (error) => {
      this.initForm();
      console.log(error);
    });
  }

  // getStyle(id: number) {
  //   this.animationService.getOneStyle(id)
  //   .subscribe(data => {
  //     this.auditPath = `${data.ae_file_path}/${data.ae_file_name}`;
  //     console.log(this.auditPath);
  //   });
  // }

  initForm() {
    this.screenForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      // 'startFrame': new FormControl(null, Validators.required),
      // 'endFrame': new FormControl(null, Validators.required),
      // 'duration': new FormControl(null, Validators.required),
      'position': new FormControl(null, Validators.compose([
        Validators.required, Validators.min(0)
      ])),
      'time_code': new FormControl(null, Validators.compose([
        Validators.required, Validators.min(0), Validators.max(Math.round(this.currentTemplate.duration))
      ])),
      'medias': new FormArray([]),
      'text': new FormArray([])
    });
    console.log(this.currentTemplate);
  }


  getAllScreen(id) {
    this.animationService.getStyleScreens(id)
      .subscribe(data => {
        if (data.screens.length === 0) {
          this.addScreen();
        } else {
          this.allScreens = data.screens;
          this.initScreenData(this.allScreens[0]);
          console.log(this.allScreens);
        }
      }, error => {
        console.log(error);
      });
  }

  initTemplateId(data) {
    this.currentTemplate = data;
    this.currentTemplateId = data.id;
    this.initTemplatesScreen(data);
  }

  initTemplatesScreen(data) {
    this.allScreens = data.screens;
    this.screensCount = this.allScreens.length;
    console.log(this.screensCount);
    console.log(this.allScreens);
  }


  initScreenData(data) {
    console.log(data);
    this.currentScreenId = data.id;
    this.image = data.preview_img;
    this.currentScreen = {
      'name': data.name,
      // 'startFrame': data.start_frame,
      // 'endFrame': data.end_frame,
      // 'duration': data.duration,
      'position': data.position,
      'time_code': data.time_code
    };
    this.screenForm.patchValue(this.currentScreen);

    if (data.medias) {
      data.medias.forEach(i => {
        let control;
        if (i.type === 'video') {
          control = new FormGroup({
            'layer': new FormControl(i.layer, Validators.required),
            'type': new FormControl(i.type, Validators.required),
            'composition': new FormControl(i.composition, Validators.required),
            'duration': new FormControl(i.duration, Validators.required),
          });
        } else if (i.type === 'image') {
          control = new FormGroup({
            'layer': new FormControl(i.layer, Validators.required),
            'type': new FormControl(i.type, Validators.required),
            'composition': new FormControl(i.composition, Validators.required)
          });
        }
        (<FormArray>this.screenForm.get('medias')).push(control);
      });
    }


    if (data.text) {
      data.text.forEach(i => {
        const control = new FormGroup({
          'layer': new FormControl(i.layer, Validators.required),
          'composition': new FormControl(i.composition, Validators.required),
        });
        (<FormArray>this.screenForm.get('text')).push(control);
      });
    }

  }

  addEmptyText() {
    const control = new FormGroup({
      'layer': new FormControl(null, Validators.required),
      'composition': new FormControl(null, Validators.required),
    });
    (<FormArray>this.screenForm.get('text')).push(control);
  }

  addEmptyVideo() {
    const control = new FormGroup({
      'layer': new FormControl(null, Validators.required),
      'type': new FormControl('video', Validators.required),
      'composition': new FormControl(null, Validators.required),
      'duration': new FormControl(null, Validators.required),
    });
    (<FormArray>this.screenForm.get('medias')).push(control);
    console.log(control.value);
  }

  addEmptyImage() {
    const control = new FormGroup({
      'layer': new FormControl(null, Validators.required),
      'type': new FormControl('image', Validators.required),
      'composition': new FormControl(null, Validators.required)
    });
    (<FormArray>this.screenForm.get('medias')).push(control);
  }

  show(event) {
    this.image = event.target.files[0];
    console.log(this.image);
  }

  changeTemplate() {
    const id = this.templatesArr.findIndex(v => v.id === this.currentTemplateId);
    this.initTemplateId(this.templatesArr[id]);
    this.clearAllFormArray();
    this.image = '';
    this.currentScreenId = null;
    this.screenForm.reset();

  }

  changeScreen() {
    this.emptyCheck = false;
    const pos = this.allScreens.findIndex(v => v.id === this.currentScreenId);
    this.clearAllFormArray();
    this.initScreenData(this.allScreens[pos]);
    // this.getAuditData(pos);
  }

  clearAllFormArray() {
    (<FormArray>this.screenForm.get('text')).controls = [];
    (<FormArray>this.screenForm.get('medias')).controls = [];
  }

  addScreen() {
    // this.image = '';
    // this.currentScreenId = null;
    // this.clearAllFormArray();
    // this.screenForm.reset();
    this.cleanCurrScreen();
  }

  cleanCurrScreen() {
    this.image = '';
    this.currentScreenId = null;
    this.screenForm.reset();
    this.currentScreen = null;
    this.clearAllFormArray();
  }

  returnForm(arrName) {
    return (<FormArray>this.screenForm.get(arrName)).controls;
  }

  getType(i) {
    return this.screenForm.controls.medias.value[i].type;
  }

  isNew() {
    return this.currentScreenId ? 'Update' : 'Create';
  }

  inputFileValidate(file) {
    return (!file && this.emptyCheck);
  }

  isString(val) {
    return typeof val === 'string';
  }

  deleteMedia(i, arrName) {
    (<FormArray>this.screenForm.get(arrName)).removeAt(i);
  }

  returnScreensCount() {
    return this.currentTemplate.pics <= this.allScreens.length;
  }

  onSubmit() {
    this.emptyCheck = true;
    if (this.currentScreenId && this.screenForm.valid) {
      console.log(this.screenForm);
      this.updateScreen();
    } else if (!this.currentScreenId && this.screenForm.valid && this.image) {
      this.createScreen();
    }
  }

  createScreen() {
    console.log(this.screenForm);
    const form = {...this.screenForm.value, image: this.image};
    console.log(form);
    // createNewScreen
    this.animationService.createNewScreen(form, this.currentTemplateId)
      .then(data => {
        this.cleanCurrScreen();
        this.getStyleByid();
        console.log(data);
        this.notifier.notify('success', `Screen '${data.name}' was creating`);
        // this.rt.navigate(['../../'], {relativeTo: this.route});
      })
      .catch(err => console.log(err));
  }

  updateScreen() {
    let form;
    console.log(this.image);
    if (this.isString(this.image)) {
      form = {...this.screenForm.value};
    } else {
      form = {...this.screenForm.value, image: this.image};
    }
    console.log(this.screenForm.value);
    console.log(form);
    this.animationService.updateScreen(form, this.styleId, this.currentScreenId)
      .then(data => {
        console.log(data);
        this.notifier.notify('success', `Screen '${data.name}' updated`);
        // this.notifier.notify('success', `Screen '${data.name}' was updating`);
        // this.rt.navigate(['../../'], {relativeTo: this.route});
        this.cleanCurrScreen();
        this.getStyleByid();
      });
  }

  ngOnDestroy() {
    // this.subscriber_1.unsubscribe();
    // this.subscriber_audit1.unsubscribe();
    // this.subscriber_audit2.unsubscribe();
    // this.subscriber_2.unsubscribe();
    // this.screenForm.reset();
  }

}
