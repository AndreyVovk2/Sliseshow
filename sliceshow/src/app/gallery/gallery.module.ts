import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GalleryRoutingModule } from './gallery.routing';
import { GalleryComponent } from './gallery/gallery.component';

import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
    declarations: [GalleryComponent],
    imports: [
        CommonModule,
        SharedModule,
        TranslateModule,
        GalleryRoutingModule

    ],
    providers: []
})
export class GalleryModule {}
