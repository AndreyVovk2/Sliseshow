import { Component, OnDestroy, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HostListener } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Meta } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

import { BlogRequestService } from '../blog-request.service';
// import { AdminStore } from '../../components/adminChange/admin.store';
import { AppStore } from '../../shared/store/app.store';
import { AdminService } from '../../shared/services/admin.service';
import { AdminStore } from '../../admin/adminChange/admin.store';

@Component({
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit, OnDestroy {

  fixed: boolean;
  images = { img_head: '' };
  imagesOnInit: Subscription;
  allBlogRecords: Subscription;
  blogsCount = 6;

  @ViewChild('content') content: ElementRef;

  @HostListener('window:scroll', ['$event'])
    onWindowScroll($event) {
      const number = window.scrollY;
      const contentheight = this.content.nativeElement.clientHeight;
      const height = window.innerHeight;
      const top = window.screenY;
      // console.log(number, height, top);
      if (number >= 400) {
        this.fixed = true; 
      } else { this.fixed = false; }
      if (number > contentheight / 2) {
        this.blogsCount += 3;
      }
  }

  constructor(
    private blog: BlogRequestService,
    public adminStore: AdminStore,
    public store: AppStore,
    private meta: Meta,
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.adminStore.savePageId(16);
    this.adminStore.changeMetaKey('Blog.Meta');

    this.getMeta();
    
    if (this.adminStore.state.blogList.length === 0) {
      this.blog.getAllBlogRecords()
      .subscribe(data => {
        console.log(data);
        data.forEach(v => {
          this.adminStore.saveAllBlogs(v);
        });
      }, error => {
        console.log(error);
      });
    }

    this.imagesOnInit = this.blog.getBlogStatic()
      .subscribe((data) => {
        this.images = data.basis.images;
      });

  }

  toSelectBlog(id) {
    this.router.navigate([id], {relativeTo: this.route});
  }

  addBlog() {

  }

  onScroll(event) {
    console.log(event);
  }


  ngOnDestroy() {
    if (this.imagesOnInit) {
    this.imagesOnInit.unsubscribe();      
    }
    if (this.allBlogRecords) {
    this.allBlogRecords.unsubscribe();      
    }
  }

  getMeta() {
    this.removeDifMeta();
    this.meta.addTag({ name: 'viewport', content: 'width=device-width' });
    this.adminService.getMetaTranslate(this.adminStore.state.metaKey, this.adminStore.state.currentLang)
    .subscribe((data) => {
      this.meta.addTags(data);
    });
  }

  removeDifMeta() {
    const metas = this.meta.getTags('name');
    metas.forEach(elem => {
      this.meta.removeTag('name= ' + elem.name);
    });
  }

  subscribeStateUpdates = (): void => {
    this.adminStore.state$.subscribe(state => {
      console.log(state);
    });
  }

}
