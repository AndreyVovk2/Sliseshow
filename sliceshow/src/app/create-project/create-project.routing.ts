import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateProjectStepOneComponent } from './create-project-step-one/create-project-step-one.component';
import { CreateProjectStepTwoComponent } from './create-project-step-two/create-project-step-two.component';
import { CreateProjectStepThreeComponent } from './create-project-step-three/create-project-step-three.component';


// const createRoutes: Routes = [
//     { path: 'create-project-step-one', component: CreateProjectStepOneComponent, data: { title: 'Step one' } },
//     { path: 'create-project-step-two', component: CreateProjectStepTwoComponent, data: { title: 'Step two' } },
//     { path: 'create-project-step-three', component: CreateProjectStepThreeComponent, data: { title: 'Step three' } },
// ];

const createRoutes: Routes = [
        { path: '', redirectTo: 'step-one'},
        { path: 'step-one', component: CreateProjectStepOneComponent }, 
        { path: 'step-two', component: CreateProjectStepTwoComponent },
        { path: 'step-three', component: CreateProjectStepThreeComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(createRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class CreateProjectRoutingModule {}
