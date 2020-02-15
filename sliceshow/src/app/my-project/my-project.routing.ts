import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MyProjectComponent } from './my-project/my-project.component';

const projectRoutes: Routes = [
  { path: '',  component: MyProjectComponent, data: { title: 'My projects' } }
];

@NgModule({
  imports: [
    RouterModule.forChild(projectRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class MyProjectRoutingModule {}
