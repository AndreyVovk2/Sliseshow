import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContactUsComponent } from './contact-us/contact-us.component';

const contactRoutes: Routes = [
  { path: '',  component: ContactUsComponent, data: { title: 'Contact us' } }
];

@NgModule({
  imports: [
    RouterModule.forChild(contactRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ContactUsRoutingModule {}
