import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyProjectRoutingModule } from './my-project.routing';
import { MyProjectComponent } from './my-project/my-project.component';

import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        MyProjectComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        MyProjectRoutingModule,
        TranslateModule

    ],
    providers: []
})
export class MyProjectModule {}
