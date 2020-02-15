import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PricingComponent } from './pricing/pricing.component';
// import { PricingService } from './pricing.service';
import { PricingRoutingModule } from './pricing.routing';

import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        PricingComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        TranslateModule,
        PricingRoutingModule

    ],
    // providers: [PricingService]
})
export class PricingModule {}
