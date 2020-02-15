import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FavoritesComponent } from './favorites/favorites.component';

const favoritesRoutes: Routes = [
  { path: '',  component: FavoritesComponent, data: { title: 'My favorites' } }
];

@NgModule({
  imports: [
    RouterModule.forChild(favoritesRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class MyFavoritesRoutingModule {}
