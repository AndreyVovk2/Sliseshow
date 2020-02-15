import { NgModule } from '@angular/core';


// --- COMPONENTS ---
import { EditingSystemComponent } from './editing-system/editing-system.component';
import { TimelineComponent } from './timeline/timeline.component';
import { DropdownButtonComponent } from './editor-components/dropdown-button/dropdown-button.component';
import { EditorHeaderComponent } from './editor-components/editor-header/editor-header.component';
import { LibraryAudioSmComponent } from './editor-components/library-audio-sm/library-audio-sm.component';
import { LibrarySectionComponent } from './editor-components/library-section/library-section.component';
import { MediaButtonComponent } from './editor-components/media-button/media-button.component';
import { OvenClockComponent } from './editor-components/oven-clock/oven-clock.component';
import { RangeSliderComponent } from './editor-components/range-slider/range-slider.component';
import { ScissorsComponent } from './editor-components/scissors/scissors.component';
import { ScreenPreviewComponent } from './editor-components/screen-preview/screen-preview.component';
import { TimelineScreenComponent } from './editor-components/timeline-screen/timeline-screen.component';
import { VerticalCarouselComponent } from './editor-components/vertical-carousel/vertical-carousel.component';
import { VideoPlayerComponent } from './editor-components/video-player/video-player.component';
import { RenderingComponent } from './rendering/rendering.component';
// --- MODALS ---
import { CropImagePopupComponent } from './editor-modals/crop-image-popup/crop-image-popup.component';
import { CropVideoPopupComponent } from './editor-modals/crop-video-popup/crop-video-popup.component';
import { EditingPopupComponent } from './editor-modals/editing-popup/editing-popup.component';
import { PopUpDonateComponent } from './editor-modals/pop-up-donate/pop-up-donate.component';
import { PopUpErrorComponent } from './editor-modals/pop-up-error/pop-up-error.component';
import { PopUpPayComponent } from './editor-modals/pop-up-pay/pop-up-pay.component';
import { DeleteSlicePopupComponent } from './editor-modals/delete-slice-popup/delete-slice-popup.component';

import { EditingSystemRoutingModule } from './editor.routing';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ColorPickerModule } from 'ngx-color-picker';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { EditErrorComponent } from './editor-components/edit-error/edit-error.component';
import { NgxPayPalModule } from 'ngx-paypal';
import {MatProgressSpinnerModule} from '@angular/material';



@NgModule({
    declarations: [
        EditingSystemComponent,
        TimelineComponent,
        DropdownButtonComponent,
        EditorHeaderComponent,
        LibraryAudioSmComponent,
        LibrarySectionComponent,
        MediaButtonComponent,
        OvenClockComponent,
        RangeSliderComponent,
        ScissorsComponent,
        ScreenPreviewComponent,
        TimelineScreenComponent,
        VerticalCarouselComponent,
        VideoPlayerComponent,
        RenderingComponent,

        CropImagePopupComponent,
        DeleteSlicePopupComponent,
        CropVideoPopupComponent,
        EditingPopupComponent,
        PopUpDonateComponent,
        PopUpErrorComponent,
        PopUpPayComponent,
        EditErrorComponent

    ],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
    EditingSystemRoutingModule,
    ColorPickerModule,
    FormsModule,
    MatSliderModule,
    NgxPayPalModule,
    MatProgressSpinnerModule
  ],
    providers: [],
    entryComponents: [
        CropImagePopupComponent,
        CropVideoPopupComponent,
        EditingPopupComponent,
        DeleteSlicePopupComponent,
        PopUpDonateComponent,
        PopUpErrorComponent,
        PopUpPayComponent]

})
export class EditorModule {}
