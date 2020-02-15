import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivacyPoliceRoutingModule } from './privacy-policy.routing';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { PrivacyPolicyService } from './privacy-policy.service';

import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
    declarations: [PrivacyPolicyComponent],
    imports: [
        CommonModule,
        SharedModule,
        TranslateModule,
        PrivacyPoliceRoutingModule
    ],
    providers: [PrivacyPolicyService]
})
export class PrivacyPolicyModule {}
