import { Component, OnInit, Inject, ElementRef } from '@angular/core';


// import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { MatSliderModule } from '@angular/material';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
// import { AppStore } from '../../shared/store/app.store';
// import { EditingStore } from '../../modules/editing-system/editing.store';
// import { LibraryService } from '../../shared/services/library.service';
import * as Cropper from 'cropperjs/dist/cropper';
import { Utility } from '../../../shared/services/utility.service';
import { EditingStore } from '../../store/editing.store';
import { LibraryService } from '../../../shared/services/library.service';
import { AppStore } from '../../../shared/store/app.store';
import { setRootDomAdapter } from '@angular/platform-browser/src/dom/dom_adapter';
// import { MatSlideToggleModule } from '@angular/material';
// import Cropper from 'cropperjs/dist/cropper.esm';
// import { Utility } from '../../shared/services/utility.service';




@Component({
  selector: 'app-crop-image-popup',
  templateUrl: './crop-image-popup.component.html',
  styleUrls: ['./crop-image-popup.component.scss']
})

export class CropImagePopupComponent implements OnInit {
  imageSrc = '';
  disableButtons = true;
  cropper;
  image;
  value = 0;
  tempValue = 0;
  rotateValue = 0;
  boxData = [500, 281.25]; // 16:9

  constructor(
    public dialogRef: MatDialogRef<CropImagePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public store: AppStore,
    public library: LibraryService,
    private dialog: MatDialog,
    private utility: Utility,
    public editingStore: EditingStore,
    public el: ElementRef
  ) {}

  ngOnInit() {
      this.imgSrc();

    // setTimeout(() => {
    //   // this.imageCropOnload();
    // }, );
    // console.log(this.someImage);
    // console.log(this.data);
    //
    // setTimeout(() => {
    //   this.imageCropOnload();
    // }, );
    // setTimeout(() => {
    //   // this.setDefaultPosition();
    //   this.selectCropPosition();
    // }, 5000);

    // setTimeout(() => this.imageCropOnload());
    // setTimeout(() => this.setDefaultPosition());

    // this.image = document.getElementById('image');
    // console.log( this.image);

    // setTimeout(() => this.imageCropOnload());
    // setTimeout(() => {
    // const getCanvasData = this.cropper.getCanvaseData();
    // let left = getCanvasData.width / 2 + getCanvasData.left / 2 - this.boxData[0] / 2;
    // let top = getCanvasData.height / 2 + getCanvasData.top / 2 - this.boxData[1] / 2;
    // this.cropper.setCropBoxData({ left, top, width: this.boxData[0], height: this.boxData[1] });
    // }, 500);
  }

  afterImageLoaded() {
    this.imageCropOnload();

  }

  imgSrc() {
    if (this.editingStore.state && this.editingStore.state.activeMediaParam.link) {
      this.imageSrc = this.editingStore.state.activeMediaParam.link;
    } else if (this.data && this.data.link) {
      this.imageSrc = this.data.link;
    }
    console.log(this.imageSrc);
    return this.imageSrc;

  }


  selectCropPosition () {
    if (this.data && this.data.link) {
      this.setDefaultPosition();
    } else if (this.data && this.data.getCanvasData) {
      this.setPosition(this.data);
    } else {
      this.setDefaultPosition();
    }
    this.disableButtons = false;
  }


  imageCropOnload() {
    // if (this.data && this.data.link) {
    //   this.image = document.getElementById('linkImage');
    // } else {
    //   this.image = document.getElementById('image');
    // }
    this.image = document.getElementById('image');
    console.log(this.image);
    this.cropper = new Cropper(this.image, {
      // viewMode: 2,
      dragMode: 'move',
      checkCrossOrigin: false,
      checkOrientation: false,
      cropBoxResizable: false,
      minCropBoxHeight: this.boxData[1],
      minCropBoxWidth: this.boxData[0],
      center: false,
      guides: false,
      scalable: false,
      zoomOnTouch: false, // TODO: check zoomOnWheel and zoomOnTouch
      zoomOnWheel: false // TODO: check zoomOnWheel and zoomOnTouch
      // zoom: ()=>{}//  TODO: check zoomOnWheel and zoomOnTouch
    });

    window['crop'] = this.cropper;

    setTimeout(() => {
      this.selectCropPosition();
    }, 3000);


  }

  zoomIn(num) {
    this.cropper.zoom(num);
  }

  rotate(event, num) {
    if (this.rotateValue === 360 || this.rotateValue === -360) {
      this.rotateValue = 0;
    }
    this.rotateValue += num;
    this.cropper.rotate(num);
  }

  onChange() {
    console.log(this.value, this.tempValue);
    const num = this.value - this.tempValue;
    this.zoomIn(num);
    this.tempValue = this.value;
  }

  saveAndUpload(event) {
    const croppedData = this.getDataCrop();
    this.closeModal(croppedData);
    // this.cropper.getCroppedCanvas().toBlob(blob => {
    //   console.log(blob);
    //   this.uploadPhoto(blob);
    // });
  }

  handleZoom(num) {
    if (this.value >= 1 && num === 0.1) {
      this.value = 1;
    } else if (this.value <= -1 && num === -0.1) {
      this.value = -1;
    } else {
      this.value += num;
      this.onChange();
    }
  }

  // uploadPhoto(file) {
  //   console.log(file);
  //   this.utility.uploadPhoto(file).then(
  //     data => {
  //       console.log(JSON.parse(data));
  //       this.editingStore.storeMedia(data.link);
  //       this.dialogRef.close();
  //     },
  //     error => {
  //       console.log(error);
  //     }
  //   );
  // }

  closeModal(croppedData = null) {
    // console.log(croppedData);
    this.dialogRef.close(croppedData);
  }

  getDataCrop() {
    const cropData = {position: this.getPosition(), crop: this.cropper.getData()};
    // console.log(cropData);
    // return this.cropper.getData();
    return cropData;
  }


  setDefaultPosition() {
    console.log('SET DEFAULT POSITION');
    const getCanvasData = this.cropper.getCanvasData();
    console.log(getCanvasData);
    const left = getCanvasData.width / 2 + getCanvasData.left - this.boxData[0] / 2;
    const top = getCanvasData.height / 2 + getCanvasData.top - this.boxData[1] / 2;
    this.cropper.setCropBoxData({ left, top, width: this.boxData[0], height: this.boxData[1] });

    console.log(this.boxData);
    let newCanvasWidth = this.boxData[0];
    let coefficient = getCanvasData.width / newCanvasWidth;
    let newCanvasHeight = getCanvasData.height * coefficient;
    console.log(newCanvasHeight);

    if (newCanvasHeight < this.boxData[1]) {
      newCanvasHeight = this.boxData[1];
      coefficient = getCanvasData.height / newCanvasHeight;
      newCanvasWidth = getCanvasData.width * coefficient;
    }
    console.log(this.cropper);
    console.log(newCanvasWidth);
    console.log(newCanvasHeight);
    this.cropper.setCanvasData({ width: newCanvasWidth, height: newCanvasHeight });

    const getContainerData = this.cropper.getContainerData();
    const getImageData = this.cropper.getImageData();

    const leftCanvas = getContainerData.width / 2 - getImageData.width / 2;
    const topCanvas = getContainerData.height / 2 - getImageData.height / 2;

    this.cropper.setCanvasData({ top: topCanvas, left: leftCanvas });
  }

  getPosition() {
    const data = {
      getData: {},
      getCanvasData: {},
      getCropBoxData: {},
      setContainerData: {}
    };

    const getCanvasData = this.cropper.getCanvasData();
    delete getCanvasData.naturalHeight;
    delete getCanvasData.naturalWidth;

    data.getCanvasData = getCanvasData;
    data.getData = { rotate: this.cropper.getData().rotate };
    data.getCropBoxData = { left: this.cropper.getCropBoxData().left, top: this.cropper.getCropBoxData().top };

    return data;
  }

  setPosition(data) {
    console.log('SET POSITION');
    console.log(data);
    this.cropper.setCropBoxData(data.getCropBoxData);
    this.cropper.setData(data.getData);
    this.cropper.setCanvasData(data.getCanvasData);
    this.rotateValue = data.getData.rotate;
  }
}
