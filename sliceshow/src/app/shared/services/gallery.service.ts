
import {tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {RequestService} from './request.service';
import {COMMON_URL} from './common.url';
import {Observable} from 'rxjs/Observable';
import {HelperService} from './helper.service';

@Injectable()
export class GalleryService {

  public categoriesNames = [];

  constructor(public request: RequestService,
              public help: HelperService) {
  }

  getAllCategories(): Observable<any> {
    return this.request.get(COMMON_URL.gallery.all_categories).pipe(
      tap((result) => {
          // this.collectCategoriesNames(result);
          console.warn('"All categories" data has received.');
        },
        () => {
          console.error('"All categories" error.');
        }));
  }

  /** This function must return list of animation styles by category ID */
  getOneCategory(id: number): Observable<any> {
    console.log(id);
    return this.request.get(`${COMMON_URL.gallery.one_category}${id}`).pipe(
      tap((data) => {
          console.log(data);
          console.warn('"One category" data has received.');
        },
        () => {
          console.error('"One category" error.');
        }));
  }

  allSubcategories(): Observable<any> {
    return this.request.get(COMMON_URL.gallery.subcat).pipe(
      tap((data) => {
          console.log(data);
          // console.warn('"All subcategories" data has received.');
        },
        () => {
          console.error('"All subcategories" error.');
        }));
  }


  getAllSubcategories(catId: number): Observable<any> {
    // /subcategories
    return this.request.get(`${COMMON_URL.gallery.all_subcategories}${catId}`).pipe(
      tap(() => {
          console.warn('"All subcategories" data has received.');
        },
        () => {
          console.error('"All subcategories" error.');
        }));
  }

  getOneSubcategory(catId: number, subCatId: number): Observable<any> {
    return this.request.get(`${COMMON_URL.gallery.all_categories}${catId}/subcategories/${subCatId}`).pipe(
      tap(() => {
          console.warn('"One subcategory" data has received.');

        },
        () => {
          console.error('"One subcategory" error.');
        }));
  }

  getAllAnimationStyles(): Observable<any> {
    return this.request.get(`${COMMON_URL.gallery.all_styles}`).pipe(
      tap((data) => {
          // console.warn('"All animation styles" data has received.');
          // this.help.setImageUrl(data);
          // console.warn(data);
        },
        (error) => {
          console.error('"All animation styles" error.');
          console.error(error);
        }));
  }

  geAnimationStylesByHash(id: number): Observable<any> {
    return this.request.get(`${COMMON_URL.gallery.one_style}${id}/styles`).pipe(
      tap((data) => {
          console.log(data);
          // console.warn('"One animation style" data has received.');
          // this.help.setImageUrl(data);
        },
        () => {
          console.error('"One animation style" error.');
        }));
  }

  getAnimationStylesForCat(id): Observable<any> {
    return this.request.get(`${COMMON_URL.gallery.one_category}${id}/styles`).pipe(
      tap( (data) => {
        console.log(data);
      }, (error) => {
        console.log(error);
      })
    );
  }


  getStaticData(): Observable<any> {
    return this.request.get(`${COMMON_URL.static_pages.gallery}`).pipe(
      tap((data) => {
          console.log('Success');
        },
        () => {
          console.error('"One animation style" error.');
        }));
  }

  getAllFavorites(): Observable<any> {
    return this.request.get(`${COMMON_URL.favorites.add}`).pipe(
      tap((data) => {
          console.log('Success');
        },
        (error) => {
          console.error(error);
        }));
  }

  changeFavorites(favor): Observable<any> {
    return this.request.post(`${COMMON_URL.favorites.add}`, favor).pipe(
      tap((data) => {
          console.log('Success');
        },
        (error) => {
          console.error(error);
        }));
  }

  getSelectedAnimationStyle(list: any): Observable<any> {
    return this.request.post(`${COMMON_URL.gallery.selected_categories}`, list).pipe(
      tap((data) => {
          console.log('Success');
        },
        () => {
          console.error('"One animation style" error.');
        }));
  }

  getAllTags(): Observable<any> {
    return this.request.get(`${COMMON_URL.gallery.tags.get_all}`).pipe(
      tap((data) => {
          console.log('Success');
        },
        (error) => {
          console.error(error);
        }));
  }
  searchByTags (id: number): Observable<any> {
    return this.request.get(`${COMMON_URL.gallery.tags.filter_tags}/${id}`).pipe(
      tap((data) => {
          console.log('Success');
        },
        (error) => {
          console.error(error);
        }));
  }




}
