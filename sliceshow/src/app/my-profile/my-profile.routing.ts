import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyProfileComponent } from './my-profile/my-profile.component';


const profileRoutes: Routes = [
  { path: '',  component: MyProfileComponent, data: { title: 'My profile' } }
];

@NgModule({
  imports: [
    RouterModule.forChild(profileRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class MyProfileRoutingModule {}
