import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LibraryComponent } from './library/library.component';
import { LibraryMyMusicComponent } from './library/library-my-music/library-my-music.component';
import { LibraryMyVideosComponent } from './library/library-my-videos/library-my-videos.component';
import { LibraryMyPhotosComponent } from './library/library-my-photos/library-my-photos.component';

const libraryRoutes: Routes = [
    { path: '', component: LibraryComponent, data: { title: 'Library' },  children: [
          { path: 'my-music', component: LibraryMyMusicComponent }, 
          { path: 'my-videos', component: LibraryMyVideosComponent },
          { path: 'my-photos', component: LibraryMyPhotosComponent }
        ]
      }
];

@NgModule({
  imports: [
    RouterModule.forChild(libraryRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class LibraryRoutingModule {}
