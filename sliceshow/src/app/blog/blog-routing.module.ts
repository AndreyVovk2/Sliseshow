import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogDetailComponent } from './blog-detail/blog-datail.component';

const blogsRoutes: Routes = [
  { path: '',  component: BlogListComponent },
  { path: ':id', component: BlogDetailComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(blogsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class BlogsRoutingModule { }
