import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateProjectRoutingModule } from './create-project.routing';
import { CreateProjectStepTwoComponent } from './create-project-step-two/create-project-step-two.component';
import { CreateProjectStepThreeComponent } from './create-project-step-three/create-project-step-three.component';
import { CreateProjectStepOneComponent } from './create-project-step-one/create-project-step-one.component';
import { CartComponent } from './cart/cart.component';

import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
    declarations: [
        CreateProjectStepOneComponent,
        CreateProjectStepTwoComponent,
        CreateProjectStepThreeComponent,
        CartComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        CreateProjectRoutingModule,
        TranslateModule,
    ],
    providers: []
})
export class CreateProjectModule {}
