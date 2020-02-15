import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';



const aboutUsRoutes: Routes = [
  { path: '',  component: AboutUsComponent, data: { title: 'About us' } }
];

@NgModule({
  imports: [
    RouterModule.forChild(aboutUsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AboutUsRoutingModule {}
