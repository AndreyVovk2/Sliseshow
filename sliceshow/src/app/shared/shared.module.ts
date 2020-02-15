import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {TranslateModule} from '@ngx-translate/core';
import {OrderModule} from 'ngx-order-pipe';
import {FacebookModule} from 'ngx-facebook';

import {AngularEditorModule} from '@kolkov/angular-editor';
import {AngularEditorService} from '@kolkov/angular-editor';

// --- COMPONENTS ---
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {ProfileHeaderComponent} from './components/profile-header/profile-header.component';
import {SpinnerComponent} from './components/spinner/spinner.component';
import {LibraryAudioComponent} from './components/library-audio/library-audio.component';
import {PendingSongComponent} from './components/pending-song/pending-song.component';
import {ButtonSmComponent} from './components/button-sm/button-sm.component';
import {SearchComponent} from './components/search/search.component';
import {TagsListComponent} from './components/tags-list/tags-list.component';
import {ImageWrapperBlockComponent} from './components/image-wrapper-block/image-wrapper-block.component';
import {CategoryWrapperBlockComponent} from './components/category-wrapper-block/category-wrapper-block.component';
import {DropdownComponent} from './components/dropdown/dropdown.component';
import {RoundedButtonComponent} from './components/rounded-button/rounded-button.component';
import {UploadButtonComponent} from './components/upload-button/upload-button.component';
// --- PIPES & DIRECTIVES ---
import {ToMinutes} from './pipes/to-minutes';
import {AdminChangeDirective} from '../admin/adminChange/main/admin-change.directive';
import {PricingChangeDirective} from '../admin/adminChange/pricing-change/pricing-change.directive';
import {ToDate} from './pipes/to-date';
import {MinuteSecondsPipe} from './pipes/seconds-to-minutes';
import {ToTime} from './pipes/to-time';
import {DropdownDirective} from './directives/dropdown';
import {DraggableDirective} from './directives/draggable';
import {ClickOutsideDirective} from './directives/click-outside';
import {DndDirective} from '../my-library/library/drag-your-files/dnd.directive';
// --- MODALS ---
import {ConfirmEmailPopupComponent} from './modals/confirm-email-popup/confirm-email-popup.component';
import {ForgotPassComponent} from './modals/forgot-pass-popup/forgot-pass.component';
import {NewPassComponent} from './modals/new-pass-popup/new-pass.component';
import {PlayPopupComponent} from './modals/play-popup/play-popup.component';
import {PopUpLeftComponent} from './modals/pop-up-left/pop-up-left.component';
import {PopUpProjectNameComponent} from './modals/pop-up-project-name/pop-up-project-name.component';
import {PopUpSliceComponent} from './modals/pop-up-slice/pop-up-slice.component';
import {PopUpVerifyEmailComponent} from './modals/pop-up-verify-email/pop-up-verify-email.component';
import {ProjectDeletePopupComponent} from './modals/project-delete-popup/project-delete-popup.component';
import {ProjectUpgradePopupComponent} from './modals/project-upgrade-popup/project-upgrade-popup.component';
import {SignInComponent} from './modals/sign-in-popup/sign-in.component';
import {WrongFileFormatComponent} from './modals/wrong-file-format/wrong-file-format.component';
import {SignUpComponent} from './modals/sign-up-popup/sign-up.component';
import {PopUpOneSliceComponent} from './modals/pop-up-one-slice/pop-up-one-slice.component';
import {CheckboxComponent} from '../unused/checkbox/checkbox.component';
import {EmptyPageComponent} from '../unused/empty-page/empty-page.component';
import {ImageEditorComponent} from '../unused/image-editor/image-editor.component';
import {MainVideoPopupComponent} from '../unused/main-video-popup/main-video-popup.component';
import {SubcategoriesPopupComponent} from '../admin/animation-editor/subcategories-popup/subcategories-popup.component';
import {AddSubscriberPopupComponent} from '../admin/add-subscriber-popup/add-subscriber-popup.component';
import {UserItemComponent} from '../admin/animation-editor/user/user-item/user-item.component';
import {LibraryPreviewFilesComponent} from '../my-library/library/library-preview-files/library-preview-files.component';
import {AnimationDeletePopupComponent} from '../admin/animation-editor/animation-delete-popup/animation-delete-popup.component';
import {DragYourFilesComponent} from '../my-library/library/drag-your-files/drag-your-files.component';
import {AudioPopupComponent} from '../admin/animation-editor/audio-popup/audio-popup.component';

import {MatDialogModule} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatDividerModule} from '@angular/material/divider';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {LoadProgressComponent} from './components/load-progress/load-progress.component';

import {TitleService} from './services/title.service';
import {PopUpShopingCartComponent} from './modals/pop-up-shoping-cart/pop-up-shoping-cart/pop-up-shoping-cart.component';
import {PopUpNotPaidComponent} from './modals/pop-up-not-paid/pop-up-not-paid.component';
import {ModalErrorRenderComponent} from './modals/modal-error-render/modal-error-render.component';
import {HttpClientModule} from '@angular/common/http';
// import { AuthGuard }  from './guards/auth-guard.service';
// import { UserIdGuard } from './guards/userId-guard.service';
// import { AdminGuard } from './guards/admin-guard.service';


@NgModule({
  imports: [HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TranslateModule,
    OrderModule,
    FacebookModule.forRoot(),
    AngularEditorModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatInputModule,

    MatMenuModule,
    MatSelectModule,
    MatDividerModule,
    MatRadioModule,
    MatCheckboxModule,
    MatProgressBarModule

  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    PopUpNotPaidComponent,
    ButtonSmComponent,
    CategoryWrapperBlockComponent,
    DropdownComponent,
    ImageWrapperBlockComponent,
    LibraryAudioComponent,
    PendingSongComponent,
    ProfileHeaderComponent,
    RoundedButtonComponent,
    SearchComponent,
    SpinnerComponent,
    TagsListComponent,
    UploadButtonComponent,
    LoadProgressComponent,

    CheckboxComponent,
    EmptyPageComponent,
    ImageEditorComponent,
    MainVideoPopupComponent,

    AdminChangeDirective,
    PricingChangeDirective,
    DndDirective,
    DropdownDirective,
    DraggableDirective,
    ClickOutsideDirective,
    ToDate,
    MinuteSecondsPipe,
    ToMinutes,
    ToTime,

    ConfirmEmailPopupComponent,
    ForgotPassComponent,
    NewPassComponent,
    PlayPopupComponent,
    PopUpLeftComponent,
    PopUpOneSliceComponent,
    PopUpProjectNameComponent,
    PopUpSliceComponent,
    PopUpVerifyEmailComponent,
    ProjectDeletePopupComponent,
    ProjectUpgradePopupComponent,
    SignInComponent,
    SignUpComponent,
    WrongFileFormatComponent,
    SubcategoriesPopupComponent,
    AddSubscriberPopupComponent,
    UserItemComponent,
    LibraryPreviewFilesComponent,
    AnimationDeletePopupComponent,
    DragYourFilesComponent,
    AudioPopupComponent,
    PopUpShopingCartComponent,
    PopUpNotPaidComponent,
    ModalErrorRenderComponent
  ],
  exports: [
    PopUpNotPaidComponent,
    HeaderComponent,
    FooterComponent,
    ButtonSmComponent,
    CategoryWrapperBlockComponent,
    DropdownComponent,
    ImageWrapperBlockComponent,
    LibraryAudioComponent,
    PendingSongComponent,
    ProfileHeaderComponent,
    PopUpShopingCartComponent,
    RoundedButtonComponent,
    SearchComponent,
    SpinnerComponent,
    TagsListComponent,
    UploadButtonComponent,
    LoadProgressComponent,

    AdminChangeDirective,
    PricingChangeDirective,
    DropdownDirective,
    DraggableDirective,
    ClickOutsideDirective,
    DndDirective,
    ToDate,
    MinuteSecondsPipe,
    ToMinutes,
    ToTime,
    ConfirmEmailPopupComponent,
    ForgotPassComponent,
    NewPassComponent,
    PlayPopupComponent,
    PopUpLeftComponent,
    PopUpProjectNameComponent,
    PopUpSliceComponent,
    PopUpVerifyEmailComponent,
    ProjectDeletePopupComponent,
    ProjectUpgradePopupComponent,
    SignInComponent,
    SignUpComponent,
    WrongFileFormatComponent,
    DragYourFilesComponent,
    AudioPopupComponent,
    MatProgressBarModule,

    OrderModule
  ],
  entryComponents: [PopUpShopingCartComponent, SignUpComponent, SignInComponent, ForgotPassComponent, NewPassComponent, ModalErrorRenderComponent,
    PopUpProjectNameComponent, PopUpSliceComponent, PopUpLeftComponent, PopUpVerifyEmailComponent, PopUpNotPaidComponent, ConfirmEmailPopupComponent,
    ProjectDeletePopupComponent, ProjectUpgradePopupComponent, WrongFileFormatComponent, PlayPopupComponent,
    SubcategoriesPopupComponent, AddSubscriberPopupComponent, UserItemComponent, PopUpOneSliceComponent,
    LibraryPreviewFilesComponent, AnimationDeletePopupComponent, DragYourFilesComponent, AudioPopupComponent],

  providers: [AngularEditorService, TitleService]
  // , AuthGuard, UserIdGuard, AdminGuard
})
export class SharedModule {
}
