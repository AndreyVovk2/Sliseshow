import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PricingComponent } from './pricing/pricing.component';



const pricingRoutes: Routes = [
  { path: '',  component: PricingComponent, data: { title: 'Pricing' } }
];

@NgModule({
  imports: [
    RouterModule.forChild(pricingRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class PricingRoutingModule {}
