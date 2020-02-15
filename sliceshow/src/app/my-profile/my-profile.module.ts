import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MyProfileRoutingModule } from './my-profile.routing';
import { MyProfileComponent } from './my-profile/my-profile.component';

import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [MyProfileComponent],
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule,
        MyProfileRoutingModule
    ],
    providers: []
})
export class MyProfileModule {}
