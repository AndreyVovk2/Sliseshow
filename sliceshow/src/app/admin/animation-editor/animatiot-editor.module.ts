import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';


import { AnimationEditorRoutingModule } from './animation-editor.routing';
import { AnimationEditorComponent } from './animation-main/animation-editor.component';
import { AnimationStyleComponent } from './animation-style/animation-style.component';
import { AnimationListComponent } from './animation-list/animation-list.component';
import { AnimationScreenComponent } from './animation-screen/animation-screen.component';
import { CategoryEditorComponent } from './category-editor/category-editor.component';
import { AudioEditorComponent } from './audio-editor/audio-editor.component';
import { AnimationService } from './animation.service';
import { AudioService } from '../../shared/services/audio.service';

import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material';
import { MatDividerModule, MatSelectModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material';
import { UserListComponent } from './user/user-list/user-list.component';
import { TagsEditorComponent } from './tags-editor/tags-editor.component';
import { StylesPopupComponent } from './styles-popup/styles-popup.component';
import { TagsPopupComponent } from './tags-popup/tags-popup.component';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { ScreensPopupComponent } from './screens-popup/screens-popup.component';

// import { DragYourFilesComponent } from '../../my-library/library/drag-your-files/drag-your-files.component';



@NgModule({
    declarations: [
        AnimationEditorComponent,
        AnimationStyleComponent,
        AnimationListComponent,
        AnimationScreenComponent,
        AudioEditorComponent,
        CategoryEditorComponent,
        UserListComponent,
        TagsEditorComponent,
        StylesPopupComponent,
        TagsPopupComponent,
        GeneralSettingsComponent,
        ScreensPopupComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        AnimationEditorRoutingModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatDividerModule,
        MatSelectModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        MatButtonModule,
        MatInputModule,
        AngularEditorModule,
        MatDialogModule,

    ],
    providers: [AnimationService, AudioService],
    entryComponents: [StylesPopupComponent, TagsPopupComponent, ScreensPopupComponent],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

})
export class AnimationEditorModule {}
