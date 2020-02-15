import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { HowItWorksRoutingModule } from './how-it-works.routing';
import { HowItWorksService } from './how-it-works.service';

import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        HowItWorksComponent
    ],
    imports: [
        CommonModule,
        HowItWorksRoutingModule,
        SharedModule,
        TranslateModule
    ],
    providers: [HowItWorksService]
})
export class HowItWorksModule {}
