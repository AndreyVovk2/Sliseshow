import {Injectable} from '@angular/core';
import {COMMON_URL} from './common.url';
// import {runInThisContext} from "vm";
// import arrayContaining = jasmine.arrayContaining;

@Injectable()
export class HelperService {

  constructor() {
  }

  /** Function for rebuild images urls of received data.
   * Pass the array of objects as a parameter.
   * Common form is data.body.images*/
  // setImageUrl(data) {
  //   const imageUrl = COMMON_URL.image_url;
  //   data.forEach((v) => {
  //     for (let image in v) {
  //       console.log(image);
  //       v[image] = `${imageUrl}${v[image]}`;
  //     }
  //   });
  // }
  setImageUrl(data) {
    const imageUrl = COMMON_URL.image_url;
    data.forEach((v) => {
        v.file = `${imageUrl}${v.file}`;
      // }
    });
  //  * Pass the array of objects as a parameter.*/
  // setImageUrl(data) {
  //   const imageUrl = COMMON_URL.image_url;
  //   const handler = function (elem) {
  //     if (elem.hasOwnProperty('basis')) {
  //       const images = elem.basis.images;
  //       for (const image in images) {
  //         console.log(image);
  //         images[image] = `${imageUrl}${images[image]}`;
  //       }
  //     } else {
  //       elem.image = `${imageUrl}${elem.image}`;
  //     }
  //   };

  //   if (data.hasOwnProperty('length')) {
  //     data.forEach((v) => {
  //       handler(v);
  //     });
  //   } else {
  //     handler(data);
  //   }
  }

}
