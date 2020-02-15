import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { BlogDetailComponent } from './blog-detail/blog-datail.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogRequestService } from './blog-request.service';

import { BlogsRoutingModule } from './blog-routing.module';
import { SharedModule } from '../shared/shared.module';
import { BlogChangeDirective } from '../admin/adminChange/blog-change/blog-change.directive';


@NgModule({
    declarations: [
        BlogDetailComponent,
        BlogListComponent,
        BlogChangeDirective
    ],
    imports: [
        CommonModule,
        SharedModule,
        BlogsRoutingModule,
        TranslateModule
    ],
    providers: [BlogRequestService]
})

export class BlogModule {}
