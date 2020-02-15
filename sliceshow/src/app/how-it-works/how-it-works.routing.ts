import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HowItWorksComponent } from './how-it-works/how-it-works.component';

const howItWorksRoutes: Routes = [
  { path: '',  component: HowItWorksComponent, data: { title: 'How it works' } }
];

@NgModule({
  imports: [
    RouterModule.forChild(howItWorksRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class HowItWorksRoutingModule {}
