import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';

const termsRoutes: Routes = [
  { path: '',  component: TermsAndConditionsComponent, data: { title: 'Terms and Conditions' } }
];

@NgModule({
  imports: [
    RouterModule.forChild(termsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class TermsRoutingModule {}
