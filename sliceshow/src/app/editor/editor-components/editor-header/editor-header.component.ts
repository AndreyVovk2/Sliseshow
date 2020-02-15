import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {EditingStore} from '../../store/editing.store';
import {PopUpErrorComponent} from '../../editor-modals/pop-up-error/pop-up-error.component';
import {AppStore} from '../../../shared/store/app.store';
import {ProjectService} from '../../../shared/services/project.service';
import {PopUpPayComponent} from '../../editor-modals/pop-up-pay/pop-up-pay.component';
import {PopUpDonateComponent} from '../../editor-modals/pop-up-donate/pop-up-donate.component';
import {Router, ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-editor-header',
  templateUrl: './editor-header.component.html',
  styleUrls: ['./editor-header.component.scss']
})
export class EditorHeaderComponent {

  constructor(public dialog: MatDialog,
              public editingStore: EditingStore,
              public store: AppStore,
              public project: ProjectService,
              private rt: Router,
              private activeRt: ActivatedRoute) {
  }

  load = false;
  hello = setTimeout((res) =>
    this.hello, 5000);

  openDialogError() {
    // this.dialog.open(PopUpErrorComponent, {});
    this.dialog.open(PopUpDonateComponent, {});

  }

  subscribeStateUpdates = (): void => {
    this.editingStore.state$.subscribe(state => {
      console.log(state);

    });
  };


  returnAudioDuration() {
    console.log(this.editingStore.state.project.total_audio_duration);
  }


  renderActive() {
    // if (this.editingStore.state.readyToMarge) {
    this.editingStore.startMargeTemplates();
    this.rt.navigate(['../rendering'], {relativeTo: this.activeRt});
    // this.editingStore.startRednderAndMerge();
    // const dt = this.editingStore.getRenderDataForMerge();
    // console.log(dt);
    // }
  }

  readyToMerge() {

    return this.editingStore.state.readyToMarge && this.editingStore.freePreviewValid();
  }


  readyToRemoveWatemark() {
    console.log(this.editingStore.state.readyToRemoveWatemark);
    return this.editingStore.state.readyToRemoveWatemark;
    // return this.editingStore._isTemplateCompleted(this.editingStore.state);
  }

  renderBtnValid() {
    if (this.editingStore.state.project) {
      return this.editingStore.state.disableAutoRender
        || this.editingStore.state.project.mergeStatus
        || this.editingStore.state.project.renderAndMerge
        || this.checkIsRendering()
        || !this.checkScreensComplete();
    } else {
      return true;
    }

  }

  checkIsRendering() {
    if (this.editingStore.state.activeAnimationStyle && !this.editingStore.state.activeAnimationStyle.is_rendering) {
      return false;
    } else {
      return true;
    }
  }

  checkScreensComplete() {

    if (this.editingStore.state.activeAnimationStyle && this.editingStore.state.activeAnimationStyle.screens) {
      this.editingStore.waterMarkValid();
      return this.editingStore.state.activeAnimationStyle.screens.every(screen => screen.completed === true);

    } else {
      return false;

    }
  }

}
