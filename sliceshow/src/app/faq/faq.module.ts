import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaqRoutingModule } from './faq.routing';
import { FaqComponent } from './faq/faq.component';
import { FaqService } from './faq.service';

import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
    declarations: [FaqComponent],
    imports: [
        CommonModule,
        SharedModule,
        FaqRoutingModule,
        TranslateModule,
        MatExpansionModule
    ],
    providers: [FaqService]
})
export class FaqModule {}
