import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditingSystemComponent } from './editing-system/editing-system.component';
import { RenderingComponent } from './rendering/rendering.component';
import { UserIdGuard } from '../shared/guards/userId-guard.service';
import { PageNotFoundComponent } from '../main/page-not-found/page-not-found.component';
import { EditErrorComponent } from './editor-components/edit-error/edit-error.component';


const editorRoutes: Routes = [
    { path: '', children: [
      { path: 'rendering', component: RenderingComponent, data: { title: 'Rendering' } },
      { path: ':id', component:  EditingSystemComponent, data: { title: 'Editing system' }, canActivate: [UserIdGuard] },
      { path: '', component: EditErrorComponent}
    ] }
];


@NgModule({
  imports: [
    RouterModule.forChild(editorRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class EditingSystemRoutingModule {}
