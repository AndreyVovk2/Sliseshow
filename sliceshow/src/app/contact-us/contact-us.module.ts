import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ContactUsService } from './contact-us.service';
import { ContactUsRoutingModule } from './contact-us.routing';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { AgmCoreModule } from '@agm/core';
import {AdminChangeComponent} from '../admin/adminChange/main/admin-change';

@NgModule ({
    declarations: [
        ContactUsComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        AgmCoreModule,
        CommonModule,
        SharedModule,
        TranslateModule,
        ContactUsRoutingModule
    ],
    providers: [ContactUsService ]
})
export class ContactUsModule {}
