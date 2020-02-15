import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TermsRoutingModule } from './terms-and-conditions.routing';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { TermsAndConditionsService } from './terms-and-conditions.service';

import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [TermsAndConditionsComponent],
    imports: [
        CommonModule,
        SharedModule,
        TranslateModule,
        TermsRoutingModule
    ],
    providers: [TermsAndConditionsService]
})
export class TermsAndConditionsModule {}
