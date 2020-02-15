import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {Observable} from 'rxjs/Observable';

import {BlogRequestService} from '../blog-request.service';
import {AdminStore} from '../../admin/adminChange/admin.store';
import {Subscription} from 'rxjs/Subscription';

// import { AdminStore } from '../../components/adminChange/admin.store';

@Component({
  templateUrl: './blog-datail.component.html',
  styleUrls: ['./blog-datail.component.scss']
})
export class BlogDetailComponent implements OnInit, OnDestroy {

  blog$: Observable<any>;
  images = {img_head: ''};
  imagesOnInit: Subscription;
  public selectId: number;
  public selectBlog;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blog: BlogRequestService,
    private adminStore: AdminStore
  ) {
  }

  ngOnInit() {
    this.getBlog();
  }

  getBlog() {
    window.scrollTo(0, 0);
    this.adminStore.savePageId(16);
    this.selectId = this.route.snapshot.params.id;
    this.blog.getOneBlogRecord(this.selectId)
      .subscribe(data => {
        this.selectBlog = data;
      }, error => {
        this.router.navigate(['./blog']);
      });


    this.imagesOnInit = this.blog.getBlogStatic()
      .subscribe((data) => {
        this.images = data.basis.images;
      });
  }

  ngOnDestroy() {
    this.imagesOnInit.unsubscribe();
  }

  subscribeStateUpdates = (): void => {
    this.adminStore.state$.subscribe(state => {
      // console.log(state);
    });
  };

}
