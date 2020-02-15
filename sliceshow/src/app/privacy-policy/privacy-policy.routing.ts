import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

const privacyRoutes: Routes = [
  { path: '',  component: PrivacyPolicyComponent, data: { title: 'Privacy policy' } }
];

@NgModule({
  imports: [
    RouterModule.forChild(privacyRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class PrivacyPoliceRoutingModule {}
