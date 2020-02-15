import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GalleryComponent } from './gallery/gallery.component';


const galleryRoutes: Routes = [
  { path: '',  component: GalleryComponent, data: { title: 'Gallery' } }
];

@NgModule({
  imports: [
    RouterModule.forChild(galleryRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class GalleryRoutingModule {}
