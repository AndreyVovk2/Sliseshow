import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutUsComponent } from './about-us/about-us.component';
import { AboutUsRoutingModule } from './about-us.routing';
import { AboutUsService } from './about-us.service';

import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        AboutUsComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        AboutUsRoutingModule,
        TranslateModule
    ],
    providers: [AboutUsService],
})
export class AboutUsModule {}
