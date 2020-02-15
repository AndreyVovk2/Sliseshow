
import {tap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { COMMON_URL } from './common.url';
import { Observable } from 'rxjs';


@Injectable()
export class CategoryService {

    constructor(public request: RequestService) { }


    getAllCategories(): Observable<any> {
        return this.request.get(COMMON_URL.gallery.all_categories).pipe(
          tap((data) => {
              console.log(data);
            },
            () => {
              console.error('"Contact us" error.');
            }));
    }

    deleteCategory(id): Observable<any> {
        return this.request.destroy(`${COMMON_URL.gallery.all_categories}/${id}`).pipe(
          tap((data) => {
              console.log(data);
            },
            () => {
              console.error('"Delete Category" error.');
            }));
    }


    addCategory(category): Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {
            console.log(category);
            const { token } = JSON.parse(localStorage.getItem('currentUser'));
            const url = `${COMMON_URL.gallery.all_categories}`;
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

            category.subCategories.map( (el, index) => {
                formData.append('subCategories[' + index + ']', el);
                console.log(el);
              });
            
            formData.append('name', category.nameEng);
            formData.append('name_hreb', category.name_hreb);
            formData.append('file', category.image);
            
            
            xhr.send(formData);
            // console.log(formData);
        });
        return promise;
      }

      updateCategory(category, id): Promise<any> {
      console.log(category);
      console.log(id);
        const promise = new Promise<any>((resolve, reject) => {
            console.log(category);
            const { token } = JSON.parse(localStorage.getItem('currentUser'));
            const url = `${COMMON_URL.gallery.all_categories}/${id}`;
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
                    // Error. Inform the userRSA_PKCS1_PADDING
                    console.log(xhr.response);
                    reject();
                }
            });

            // category.subCategories.map( (el, index) => {
            //     formData.append('subCategories[' + index + ']', el);
            //     console.log(el);
            //   });

            if (category.subCategories) {
              category.subCategories.map( (el, index) => {
                  // formData.append('subCategories[' + index + ']', el);
                  formData.append('subCategories[]', el);
                  console.log(el);
                });
            }
            
            // formData.append('name', category.name);
            formData.append('name', category.nameEng);
            if (category.nameEng) {
               formData.append('nameEng', category.nameEng);
            }
            if (category.name_hreb) {
              formData.append('name_hreb', category.name_hreb);
            }

            if (category.image) {
                formData.append('file', category.image);
            }
            
            
            
            xhr.send(formData);
            // console.log(formData);
        });
        return promise;
      }

    getAllSubcategories(): Observable<any> {
        return this.request.get(COMMON_URL.gallery.subcat).pipe(
          tap((data) => {
              console.log(data);
            },
            () => {
              console.error('"getAllSubcategories" error.');
            }));
    }

    addSubcategories(subcat: any): Observable<any> {
      console.log(subcat);
        return this.request.post(COMMON_URL.gallery.subcat, subcat).pipe(
          tap((data) => {
              console.log(data);
            },
            () => {
              console.error('"addSubcategories" error.');
            }));
    }

    addSubCatWithImg(subcat: any): Promise<any> {
      console.log(subcat);
      const promise = new Promise<any>((resolve, reject) => {
        const { token } = JSON.parse(localStorage.getItem('currentUser'));
        const url = `${COMMON_URL.gallery.subcat}`;
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
            // Error.
            console.log(xhr.response);
            reject();
          }
        });

        formData.append('name', subcat.name);
        formData.append('name_hreb', subcat.name_hreb);
        formData.append('file', subcat.image);

        xhr.send(formData);
      });

      return promise;
    }


    updateSubCatWithImg(subcat: any, id: number): Promise<any> {
      console.log(subcat);
      const promise = new Promise<any>((resolve, reject) => {
        const { token } = JSON.parse(localStorage.getItem('currentUser'));
        console.log(token);
        const url = `${COMMON_URL.gallery.subcat}/${id}`;
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        xhr.responseType = 'json';
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.addEventListener('readystatechange', e => {
          if (xhr.readyState === 4 && xhr.status === 200) {
            // Done. Inform the user
            resolve(xhr.response);

          } else if (xhr.readyState === 4 && xhr.status !== 200) {
            // Error.
            console.log(xhr.response);
            reject();
          }
        });
        formData.append('name', subcat.name);
        formData.append('name_hreb', subcat.name_hreb);
        if (subcat.image) {
          formData.append('file', subcat.image);
        }
        xhr.send(formData);

      });
      return promise;
    }

    updateSubcategories(subcat: any, id: number): Observable<any> {
      console.log(subcat);
        return this.request.put(`${COMMON_URL.gallery.subcat}/${id}`, subcat).pipe(
          tap((data) => {
              console.log(data);
            },
            () => {
              console.error('"updateSubcategories" error.');
            }));
    }

    deleteSubcategories(id: number): Observable<any> {
        return this.request.destroy(`${COMMON_URL.gallery.subcat}/${id}`).pipe(
          tap((data) => {
              console.log(data);
            },
            () => {
              console.error('"Delete Subcategories" error.');
            }));
    }
}
