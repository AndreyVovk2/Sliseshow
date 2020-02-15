import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryComponent } from './library/library.component';
import { LibraryMyPhotosComponent } from './library/library-my-photos/library-my-photos.component';
import { LibraryMyVideosComponent } from './library/library-my-videos/library-my-videos.component';
import { LibraryMyMusicComponent } from './library/library-my-music/library-my-music.component';
import { LibraryRoutingModule } from './library.routing';

import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { DragYourFilesComponent } from './library/drag-your-files/drag-your-files.component';


@NgModule({
    declarations: [
        LibraryComponent,
        LibraryMyPhotosComponent,
        LibraryMyVideosComponent,
        LibraryMyMusicComponent,

    ],
    imports: [
        CommonModule,
        SharedModule,
        TranslateModule,
        LibraryRoutingModule

    ],
    providers: [LibraryMyPhotosComponent],
    entryComponents: []
})
export class LibraryModule {}
