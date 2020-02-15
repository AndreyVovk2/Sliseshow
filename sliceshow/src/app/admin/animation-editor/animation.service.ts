import {tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
// import {RequestService} from '../shared/services/request.service';
import {COMMON_URL} from '../../shared/services/common.url';
import {Observable} from 'rxjs/Observable';
import {RequestService} from '../../shared/services/request.service';
import {text} from '@angular/core/src/render3/instructions';
import {NotifierService} from 'angular-notifier';
import {AdminStore} from '../adminChange/admin.store';
// import { EditingStore } from '../../editor/store/editing.store';
import {reject} from 'q';


@Injectable()
export class AnimationService {


  constructor(public request: RequestService,
              private readonly notifier: NotifierService,
              private adminStore: AdminStore) {
  }


  getAllAnimationStyles(): Observable<any> {
    return this.request.get(`${COMMON_URL.gallery.all_styles}`).pipe(
      tap((data) => {
        },
        (error) => {
          console.error('"All animation styles" error.', error);
        }));
  }

  removeStyle(id: number): Observable<any> {
    return this.request.destroy(`${COMMON_URL.gallery.all_styles}/${id}`).pipe(
      tap((data) => {
        },
        (error) => {
          console.error('"Remove styles" error.', error);
        }));
  }

  getStyleScreens(id: number): Observable<any> {
    return this.request.get(`${COMMON_URL.gallery.all_styles}/${id}/screens`).pipe(
      tap((data) => {
        },
        (error) => {
          console.error('"Get styles screens" error.', error);
        }));
  }

  updateScreen(screen, idStyle, idScreen): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
      const {token} = JSON.parse(localStorage.getItem('currentUser'));
      const url = `${COMMON_URL.gallery.all_styles}/${idStyle}/screens/${idScreen}`;
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      xhr.responseType = 'json';
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.addEventListener('readystatechange', (e) => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          resolve(xhr.response);

        } else if (xhr.readyState === 4 && xhr.status !== 200) {
          console.log(xhr.response);
          reject();
        }
      });

      if (screen.medias.length !== 0) {
        screen.medias.map((pic, index) => {
          formData.append('medias[' + index + '][layer]', pic.layer);
          formData.append('medias[' + index + '][composition]', pic.composition);
          formData.append('medias[' + index + '][type]', pic.type);
          if (pic.type === 'video') {
            formData.append('medias[' + index + '][duration]', pic.duration);
          }
        });
      }

      if (screen.text.length !== 0) {
        screen.text.map((t, index) => {
          formData.append('text[' + index + '][layer]', t.layer);
          formData.append('text[' + index + '][composition]', t.composition);
        });
      }

      formData.append('name', screen.name);
      formData.append('position', screen.position);
      formData.append('time_code', screen.time_code);

      if (screen.preview_img) {
        console.log(screen.preview_img);
        formData.append('file', screen.preview_img);
      }
      if (screen.image) {
        formData.append('file', screen.image);
      }
      // for (const value of formData.values()) {
      //     console.log(value);
      // }
      xhr.send(formData);

    });
    return promise;
  }


  createScreen(screen, id): Promise<any> {
    console.log(screen.name);
    console.log(screen);
    const formData = new FormData();
    screen.medias.map((pic, index) => {
      formData.append('medias[' + index + '][layer]', pic.layer);
      formData.append('medias[' + index + '][composition]', pic.composition);
      formData.append('medias[' + index + '][type]', pic.type);
      if (pic.type === 'video') {
        formData.append('medias[' + index + '][duration]', pic.duration);
      }
    });

    screen.text.map((t, index) => {
      formData.append('text[' + index + '][layer]', t.layer);
      formData.append('text[' + index + '][composition]', t.composition);
    });

    formData.append('name', screen.name);
    formData.append('position', screen.position);
    formData.append('file', screen.image);
    console.log(formData.get('name'));


    let postResult;
    // console.log(screen.image.File);
    // const file = {'file': screen.image};
    // Object.assign(screen, file);
    // console.log(screen);
    const promise = new Promise((resolve, reject) => {
      this.request.post(`${COMMON_URL.gallery.templates}/${id}/screens`, formData).toPromise()
        .then(
          result => {
            postResult = result;
            console.log(result);
            resolve(postResult);
          },
          error => {
            reject(error);
          }
        );

    });
    // // return this.request.post(`${COMMON_URL.gallery.templates}/${id}/screens`, screen).pipe(
    // //   tap( (result) => {
    // //     console.log(result);
    // //   }, (error) => {
    // //     console.warn(error);
    // //   })
    // // );
    return promise;
  }

  createNewScreen(screen, id): Promise<any> {
    console.log(screen, id);
    console.log(`${COMMON_URL.gallery.templates}/${id}/screens`);
    const promise = new Promise<any>((resolve, reject) => {
      const {token} = JSON.parse(localStorage.getItem('currentUser'));
      const url = `${COMMON_URL.gallery.templates}/${id}/screens`;
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      xhr.responseType = 'json';
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      // xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.addEventListener('readystatechange', (e) => {
        if (xhr.readyState === 4 && xhr.status === 201) {
          console.log(xhr.response);
          resolve(xhr.response);
        } else if (xhr.readyState === 4 && xhr.status !== 201) {
          console.log(xhr.response);
          reject();
        }
      });

      screen.medias.map((pic, index) => {
        formData.append('medias[' + index + '][layer]', pic.layer);
        formData.append('medias[' + index + '][composition]', pic.composition);
        formData.append('medias[' + index + '][type]', pic.type);
        if (pic.type === 'video') {
          formData.append('medias[' + index + '][duration]', pic.duration);
        }
      });

      screen.text.map((t, index) => {
        formData.append('text[' + index + '][layer]', t.layer);
        formData.append('text[' + index + '][composition]', t.composition);
      });

      formData.append('name', screen.name);
      formData.append('position', screen.position);
      formData.append('file', screen.image);
      formData.append('time_code', screen.time_code);

      console.log(formData.get('position'));
      console.log(formData.get('file'));
      xhr.send(formData);
    });
    return promise;
  }

  deleteScreen(idStyle, idScreen): Observable<any> {
    return this.request.destroy(`${COMMON_URL.gallery.all_styles}/${idStyle}/screens/${idScreen}`).pipe(
      tap((data) => {
        },
        (error) => {
          console.error('"Delete screen" error.', error);
        }));
  }

  getTemplatesRequest(id): Observable<any> {
    return this.request.get(`${COMMON_URL.gallery.all_styles}/${id}/templates`).pipe(
      tap((data) => {
      }, (error) => {
        console.log(error);
        console.log('Get Templates Error');
      }));
  }

  createTemplate(id, data): Observable<any> {
    console.log(data);
    return this.request.post(`${COMMON_URL.gallery.all_styles}/${id}/templates`, data).pipe(
      tap((result) => {
          this.notifier.notify('success', 'Templates created successfully.');
          // console.log(result);
        }, (error) => {
          console.warn('Create template error');
        }
      )
    );
  }

  createTemplateFormData(id, data): Promise<any> {
    console.log(data);
    const promise = new Promise<any>((resolve, reject) => {
      const {token} = JSON.parse(localStorage.getItem('currentUser'));
      const url = `${COMMON_URL.gallery.all_styles}/${id}/templates`;
      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      xhr.responseType = 'json';
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.addEventListener('readystatechange', (e) => {
        if (xhr.readyState === 4 && xhr.status === 201) {
          // this.editingStore.state.uploadProgress = 0;
          this.adminStore.state.uploadProgress = 0;
          resolve(xhr.response);
          this.notifier.notify('success', 'Templates created.');
          console.log(xhr.response);

        } else if (xhr.readyState !== 4 && xhr.status !== 201) {
          // this.editingStore.state.uploadProgress = 0;
          this.adminStore.state.uploadProgress = 0;
          console.log(xhr.response);
          this.notifier.notify('error', 'Something wrong');
          reject();
        }
      });

      formData.append('duration', data.duration);
      formData.append('pics', data.pics);
      // formData.append('file', data.project);

      if (data.video) {
        formData.append('video', data.video);
      }

      if (data.format) {
        data.format.map((form, index) => {
          formData.append('format[' + index + '][composition]', form.composition);
          formData.append('format[' + index + '][quality]', form.quality);
        });
      }

      if (data.project) {
        formData.append('archive', data.project);
      }
      console.log(formData.get('video'));

      xhr.upload.onprogress = (event) => {
        console.log(event);
        const percentDone = Math.round(100 * event.loaded / event.total);
        this.adminStore.state.uploadProgress = Math.round(100 * event.loaded / event.total);
        console.log(percentDone);
      };

      xhr.send(formData);
    });

    return promise;
  }

  updateTemplateFormData(id, templateId, data): Promise<any> {
    console.log(data);
    console.log(templateId);
    const promise = new Promise<any>((resolve, reject) => {
      const {token} = JSON.parse(localStorage.getItem('currentUser'));
      const url = `${COMMON_URL.gallery.all_styles}/${id}/templates/${templateId}`;
      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      xhr.responseType = 'json';
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.addEventListener('readystatechange', (e) => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          this.adminStore.state.uploadProgress = 0;
          this.notifier.notify('success', 'Template updated');
          resolve(xhr.response);
          console.log(xhr.response);
        } else if (xhr.readyState !== 4 && xhr.status !== 200) {
          this.adminStore.state.uploadProgress = 0;
          this.notifier.notify('error', 'Something wrong');
          console.log(xhr.response);
          reject();
        }
      });

      formData.append('duration', data.duration);
      formData.append('pics', data.pics);

      if (data.video) {
        formData.append('video', data.video);
      }

      if (data.format) {
        data.format.map((form, index) => {
          formData.append('format[' + index + '][composition]', form.composition);
          formData.append('format[' + index + '][quality]', form.quality);
        });
      }

      if (data.project) {
        formData.append('archive', data.project);
      }

      xhr.upload.onprogress = (event) => {
        console.log(event);
        const percentDone = Math.round(100 * event.loaded / event.total);
        this.adminStore.state.uploadProgress = Math.round(100 * event.loaded / event.total);
        console.log(percentDone);
      };


      xhr.send(formData);
    });
    return promise;
  }

  updateTemplate(id, templateId, data): Observable<any> {
    return this.request.put(`${COMMON_URL.gallery.all_styles}/${id}/templates/${templateId}`, data).pipe(
      tap((result) => {
        console.log(result);
        this.notifier.notify('success', 'Templates updated successfully.');
      }, (error) => {
        console.log(error);
        console.warn('updateTemplate ERROR');
      })
    );
  }

  deleteTemplate(id, templateId): Observable<any> {
    return this.request.destroy(`${COMMON_URL.gallery.all_styles}/${id}/templates/${templateId}`).pipe(
      tap((result) => {
        this.notifier.notify('success', 'Template deleted successfully.');
      }, (error) => {
        this.notifier.notify('error', 'Something wrong');
      })
    );
  }

  updateStyle(style, id): Promise<any> {
    console.log(style);
    const promise = new Promise<any>((resolve, reject) => {
      console.log(style);
      const {token} = JSON.parse(localStorage.getItem('currentUser'));
      const url = `${COMMON_URL.gallery.all_styles}/${id}`;
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      // formData.append('_method', 'PUT');
      let ivideo;
      xhr.responseType = 'json';
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.addEventListener('readystatechange', (e) => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          resolve(xhr.response);
          console.log(xhr.response);

        } else if (xhr.readyState === 4 && xhr.status !== 200) {
          console.log(xhr.response);
          reject();
        }
      });
      style.including_video === true ? ivideo = 1 : ivideo = 0;

      // if (style.format) {
      //   style.format.map( (form, index) =>  {
      //     formData.append('format[' + index + '][composition]', form.composition);
      //     formData.append('format[' + index + '][quality]', form.quality);
      //   });
      // }
      //
      // if (style.pics) {
      //   style.pics.map( (pic, index) => {
      //     formData.append('pics[' + index + '][amount]', pic.amount);
      //     formData.append('pics[' + index + '][duration]', pic.duration);
      //   });
      // }


      style.listOfSubcategory.map((pic, index) => {
        formData.append('sub_categories[' + index + ']', pic.id);
      });

      style.tags.map((pic, index) => {
        formData.append('tags[' + index + ']', pic);
      });

      formData.append('name', style.name);
      formData.append('including_video', ivideo);
      formData.append('likes', style.likes);
      formData.append('trending', style.trending);
      formData.append('description', style.description);

      if (style.project) {
        formData.append('archive', style.project);
      }
      if (style.image) {
        formData.append('file', style.image);
      }
      if (style.video) {
        formData.append('video', style.video);
      }
      console.log(formData.get('file'));
      xhr.send(formData);
    });
    return promise;
  }

  createNewStyles(style): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
      console.log(style);
      const {token} = JSON.parse(localStorage.getItem('currentUser'));
      const url = `${COMMON_URL.gallery.all_styles}`;
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      let ivideo;
      xhr.responseType = 'json';
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.addEventListener('readystatechange', (e) => {
        if (xhr.readyState === 4 && xhr.status === 201) {
          resolve(xhr.response);
          this.notifier.notify('success', 'Success');

        } else if (xhr.readyState === 4 && xhr.status !== 200) {
          console.log(xhr.response);
          reject();
        }
      });
      style.including_video === true ? ivideo = 1 : ivideo = 0;

      // style.format.map( (form, index) =>  {
      //   formData.append('format[' + index + '][composition]', form.composition);
      //   formData.append('format[' + index + '][quality]', form.quality);
      // });

      style.listOfSubcategory.map((pic, index) => {
        formData.append('sub_categories[' + index + ']', pic.id);
      });
      style.tags.map((pic, index) => {
        formData.append('tags[' + index + ']', pic);
        console.log(pic);
      });

      // style.pics.map( (pic, index) => {
      //   formData.append('pics[' + index + '][amount]', pic.amount);
      //   formData.append('pics[' + index + '][duration]', pic.duration);
      // });

      formData.append('name', style.name);
      formData.append('file', style.image);
      formData.append('description', style.description);
      formData.append('including_video', ivideo);
      formData.append('video', style.video);
      formData.append('archive', style.project);
      formData.append('likes', style.likes);
      formData.append('trending', style.trending);
      formData.append('ironman', 'bogdan');

      xhr.send(formData);
      console.log(formData.get('tags'));
    });
    return promise;
  }

  getSubCat(): Observable<any> {
    return this.request.get(`${COMMON_URL.gallery.subcat}`).pipe(
      tap((data) => {
          console.log(data);
        },
        (error) => {
          console.error('"Get subcategory" error.', error);
        }));
  }

  getOneStyle(id: number): Observable<any> {
    return this.request.get(`${COMMON_URL.gallery.all_styles}/${id}`).pipe(
      tap((data) => {
        },
        (error) => {
          console.error('"Get one style" error.', error);
        }));
  }

  getTags(): Observable<any> {
    return this.request.get(`${COMMON_URL.tags.main}`).pipe(
      tap((data) => {
        },
        (error) => {
          console.error('"Get TAGS" error.', error);
        }));
  }

  createTag(tag): Observable<any> {
    return this.request.post(`${COMMON_URL.tags.main}`, tag).pipe(
      tap((data) => {
        },
        (error) => {
          console.error('"Get TAGS" error.', error);
        }));
  }

  getStylesByTag(id): Observable<any> {
    return this.request.get(`${COMMON_URL.tags.main}/${id}`).pipe(
      tap((data) => {
        },
        (error) => {
          console.error('"Get TAGS" error.', error);
        }));
  }

  updateTag(id, tag): Observable<any> {
    return this.request.put(`${COMMON_URL.tags.main}/${id}`, tag).pipe(
      tap((data) => {
        },
        (error) => {
          console.error('"Get TAGS" error.', error);
        }));
  }

  deleteTag(id): Observable<any> {
    return this.request.destroy(`${COMMON_URL.tags.main}/${id}`).pipe(
      tap((data) => {
        },
        (error) => {
          console.error('"Get TAGS" error.', error);
        }));
  }


}
