import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AnimationEditorComponent} from './animation-main/animation-editor.component';
import {AnimationListComponent} from './animation-list/animation-list.component';
import {AnimationStyleComponent} from './animation-style/animation-style.component';
import {AnimationScreenComponent} from './animation-screen/animation-screen.component';
import {CategoryEditorComponent} from './category-editor/category-editor.component';
import {UserListComponent} from './user/user-list/user-list.component';
import {TagsEditorComponent} from './tags-editor/tags-editor.component';
import {AudioEditorComponent} from './audio-editor/audio-editor.component';
import {GeneralSettingsComponent} from './general-settings/general-settings.component';


const animationRoutes: Routes = [{
  path: '', component: AnimationEditorComponent, data: {title: 'Editor'},
  children: [
    {path: 'animations', component: AnimationListComponent, data: {title: 'Animation editor'}},
    {path: 'animations/new', component: GeneralSettingsComponent, data: {title: 'General settings'}},
    {path: 'animations/:id', component: AnimationStyleComponent, data: {title: 'Animation'}},
    {path: 'animations/:id/screens', component: AnimationScreenComponent, data: {title: 'Animation editor'}},
    {path: 'animations/:id/settings', component: GeneralSettingsComponent, data: {title: 'General settings'}},
    {path: 'categories', component: CategoryEditorComponent, data: {title: 'Category editor'}},
    {path: 'users', component: UserListComponent, data: {title: 'User list'}},
    {path: 'tags', component: TagsEditorComponent, data: {title: 'Tags editor'}},
    {path: 'audio', component: AudioEditorComponent, data: {title: 'Audio editor'}},
  ]
},

];

@NgModule({
  imports: [
    RouterModule.forChild(animationRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AnimationEditorRoutingModule {
}
