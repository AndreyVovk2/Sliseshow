import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaqComponent } from './faq/faq.component';



const faqRoutes: Routes = [
  { path: '',  component: FaqComponent, data: { title: 'Faq' } }
];

@NgModule({
  imports: [
    RouterModule.forChild(faqRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class FaqRoutingModule {}
