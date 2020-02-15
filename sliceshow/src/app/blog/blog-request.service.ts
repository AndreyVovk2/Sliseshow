
import {tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {RequestService} from '../shared/services/request.service';
import {COMMON_URL} from '../shared/services/common.url';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class BlogRequestService {

  constructor(public request: RequestService) { }

  getAllBlogRecords(): Observable<any> {
    return this.request.get(COMMON_URL.blog.all).pipe(
      tap((data) => {
          // console.warn('"All blog records" data has received.');
          // this.help.setImageUrl(data);
          // console.warn(data);
        },
        () => {
          console.error('"All blog records" error.');
        }));
  }

  getOneBlogRecord(id: number): Observable<any> {
    return this.request.get(`${COMMON_URL.blog.one}${id}`).pipe(
      tap((data) => {
          // console.warn('"One blog record" data has received.');
          // this.help.setImageUrl(data);
        },
        () => {
          console.error('"One blog record" error.');
        }));
  }

  getBlogStatic(): Observable<any> {
    return this.request.get(COMMON_URL.static_pages.blog).pipe(
      tap((data) => {
          // console.warn('"Static blog" data has received.');
          // this.help.setImageUrl(data);
        },
        () => {
          console.error('"Static blog" error.');
        }));
  }

  uploadPhoto(file, blogId): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
        console.log(file);
        const { token } = JSON.parse(localStorage.getItem('currentUser'));
        const url = `${COMMON_URL.blog.one}${blogId}`;
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        xhr.responseType = 'json';
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.addEventListener('readystatechange', (e) => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // Done. Inform the user
                resolve(xhr.response);

            } else if (xhr.readyState === 4 && xhr.status !== 200) {
                // Error. Inform the user
                console.log('Error.');
                reject();
            }
        });

        formData.append('file', file);
        xhr.send(formData);
    });
    return promise;
}

updateBlog(blog: any): Observable<any> {
  const blogId = blog.id;
  delete blog.image;
  delete blog.id;
  return this.request.post(`${COMMON_URL.blog.one}${blogId}`, blog).pipe(
    tap((data) => {
        console.log('Success');
        // console.warn('"One blog record" data has received.');
        // this.help.setImageUrl(data);
      },
      () => {
        console.error('"One blog record" error.');
      }));
}

deleteBlog(id: number): Observable<any> {
  return this.request.destroy(`${COMMON_URL.blog.one}${id}`).pipe(
    tap((data) => {
        console.log('Success');
        // console.warn('"One blog record" data has received.');
        // this.help.setImageUrl(data);
      },
      () => {  
        console.error('"One blog record" error.');
      }));
}

uploadNewBlog(blog): Promise<any> {
  const promise = new Promise<any>((resolve, reject) => {
      console.log(blog);
      const { token } = JSON.parse(localStorage.getItem('currentUser'));
      const url = `${COMMON_URL.blog.all}`;
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      xhr.responseType = 'json';
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.addEventListener('readystatechange', (e) => {
          if (xhr.readyState === 4 && xhr.status === 201) {
              // Done. Inform the user
              resolve(xhr.response);

          } else if (xhr.readyState === 4 && xhr.status !== 201) {
              // Error. Inform the userRSA_PKCS1_PADDING
              console.log(xhr.response);
              reject();
          }
      });

      formData.append('file', blog.image, blog.image.name);
      formData.append('title', blog.title);
      formData.append('creator', blog.creator);
      formData.append('created_at', blog.created_at);
      formData.append('text_blog[p1]', blog.text_blog.p1);
      formData.append('text_blog[p2]', blog.text_blog.p2);
      formData.append('text_blog[p3]', blog.text_blog.p3);
      formData.append('text_blog[p4]', blog.text_blog.p4);


      xhr.send(formData);
  });
  return promise;
}


}
