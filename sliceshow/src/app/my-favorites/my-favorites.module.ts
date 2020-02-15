import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyFavoritesRoutingModule } from './my-favorites.routing';
import { FavoritesComponent } from './favorites/favorites.component';

import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [FavoritesComponent],
    imports: [
        CommonModule,
        SharedModule,
        TranslateModule,
        MyFavoritesRoutingModule
    ],
    providers: []
})
export class MyFavoritesModule {}
