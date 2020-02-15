import {Component, OnInit, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormGroup, FormControl, Validators, FormBuilder, FormArray} from '@angular/forms';
import {AudioService} from '../../../shared/services/audio.service';
import {SharedModule} from '../../../shared/shared.module';
import {NotifierService} from 'angular-notifier';

@Component({
  selector: 'app-audio-popup',
  templateUrl: './audio-popup.component.html',
  styleUrls: ['./audio-popup.component.scss']
})

export class AudioPopupComponent implements OnInit {

  audioPopupForm: FormGroup;
  dataMisic = [];
  requestStatus = 0;
  uploadedFiles = [];
  audioStyles = [
    'Pop',
    'Jazz',
    'HardRock',
    'Classic'
  ];

  constructor(private formBuilder: FormBuilder,
              public audioService: AudioService,
              private notifier: NotifierService,
              public dialogRef: MatDialogRef<AudioPopupComponent>) {
  }


  ngOnInit() {
    this.generateAudioForm();
    this.subscribeOnClose();
    console.log('audio-popup-component');
    this.text();
  }


  generateAudioForm() {
    this.audioPopupForm = this.formBuilder.group({
      items: this.formBuilder.array([])
    });

  }

  createFormItem(audioElement) {
    return this.formBuilder.group({
      name: new FormControl(audioElement.name, Validators.compose([
        Validators.required, Validators.minLength(4), Validators.maxLength(30)
      ])),
      style: new FormControl(audioElement.style, Validators.required),
      file: new FormControl(audioElement, Validators.required)
    });
  }

  addNewFormItem(audioElement) {
    (this.audioPopupForm.controls['items'] as FormArray).push(this.createFormItem(audioElement));
  }

  onFileSelected(event) {
    // tslint:disable-next-line:no-debugger

    console.log(event.target.files);
    this.uploadedFiles = [];
    this.generateAudioForm();
    Array.from(event.target.files).map(audio => {
      this.uploadedFiles.push(audio);
    });
    if (this.uploadedFiles.length > 0) {
      this.checkFilesArr();
    }

  }

  text() {
    window.onbeforeunload = e => {
      const dialogText =  alert('Do you really want to leave this site?');
      e.returnValue = dialogText;
      return dialogText;
    };

  }

  checkFilesArr() {
    for (let i = 0; i < this.uploadedFiles.length; i++) {
      if (!this.uploadedFiles[i].type.includes('audio')) {
        this.uploadedFiles.splice(i, 1);
        i--;
      }
    }
    this.uploadedFiles.map((element) => {
      this.addNewFormItem(element);
    });
  }

  deleteFormControl(controlIndex) {
    this.uploadedFiles.splice(controlIndex, 1);
    this.audioPopupForm['controls'].items['controls'].splice(controlIndex, 1);
  }

  uploadAudio() {
    console.log(this.uploadedFiles);
    console.log(this.audioPopupForm.value.items);
    const filesForUpload = this.audioPopupForm.value.items;
    this.audioService.addRecSong(filesForUpload).then((result) => {
      console.log(result);
      this.closeModalWindow(result);
    }, (error) => {
      console.log(error);
      this.resetFormAndArray();
      this.notifier.notify('error', 'Upload Error');
    });
  }

  checkFormValid() {
    return this.audioPopupForm.valid && this.uploadedFiles;
  }

  subscribeOnClose() {
    this.dialogRef.beforeClose().subscribe((res) => {
      this.uploadedFiles = [];
    });
  }

  closeModalWindow(newSongs) {
    this.dialogRef.close(newSongs);
  }

  resetFormAndArray() {
    this.generateAudioForm();
    this.uploadedFiles = [];
  }


}
