import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AdminStore } from '../admin.store';
import { AdminService } from '../../../shared/services/admin.service'; 
import { BlogRequestService } from '../../../blog/blog-request.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-blog-change',
  templateUrl: './blog-change.component.html',
  styleUrls: ['./blog-change.component.scss']
})
export class BlogChangeComponent implements OnInit {

  newBlog = {
    title: '',
    text_blog: {
      p1: '',
      p2: '',
      p3: '',
      p4: '',
      },
    image: '',
    creator: '',
    created_at: '',
    updated_at: ''
  };

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    // height: '400px',
    // width: '700px',
    height: '300px',
    width: '600px',
    minHeight: '300px',
    maxHeight: '300px',
    placeholder: 'Enter text here...',
    // uploadUrl: 'https://slice-show.grassbusinesslabs.tk/api/subscribers/add_image',
    translate: 'no',
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ]
  };

  currentLink = 1;

  constructor(
    public dialogRef: MatDialogRef<BlogChangeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public adminStore: AdminStore,
    public service: AdminService,
    public blog: BlogRequestService,
    private readonly notifier: NotifierService
  ) { }

  ngOnInit() {
    if (!this.adminStore.state.blogAddState) {
      this.newBlog = this.adminStore.state.editBlog;
    }
  }

  createNewBlog() {
    console.log(this.newBlog);
    this.blog.uploadNewBlog(this.newBlog)
    .then(data => {
      console.log(data);
      this.adminStore.saveNewBlog(data);
      this.notifier.notify('success', 'Blog created successfully.');
      this.closeBlogEditor();
    }, error => {
      console.log(error);
      this.notifier.notify('error', 'Creating error');
    });
  }

  uploadNewImage (event) {
    this.newBlog.image = event.target.files[0];
  } 

  uploadImage(event) {
    const file = event.target.files[0];
    const blogId = this.adminStore.state.editBlog.id;
    this.blog.uploadPhoto(file, blogId)
    .then(data => {
      console.log(data);
      // this.adminStore.state.editBlog.image = data.image;
    }, error => {
      console.log(error);
      
    });
  }
  
  updateBlog() {
    const newBlog = this.adminStore.state.editBlog;
    console.log(newBlog);
    this.blog.updateBlog(newBlog)
    .subscribe(data => {
      console.log(this.adminStore.state);
      this.adminStore.updateBlog(data);
      console.log(data);
      this.notifier.notify('success', 'Blog updated successfully.');
      this.closeBlogEditor();
    }, error => {
      console.log(error);
      this.notifier.notify('error', 'Updating error');
    });
  }

  deleteBlog() {
    const delId = this.adminStore.state.editBlog.id;
    this.blog.deleteBlog(delId)
    .subscribe(data => {
      console.log(data);
      this.adminStore.deleteBlog(delId);
      this.closeBlogEditor();
    }, error => {
      console.log(error);
    });
  }

  changeParagraph(num) {
    this.currentLink = num;
  }

  closeBlogEditor() {
    this.dialogRef.close();
  }

  subscribeStateUpdates = (): void => {
    this.adminStore.state$.subscribe(state => {
      console.log(state);
    });
  }

}
