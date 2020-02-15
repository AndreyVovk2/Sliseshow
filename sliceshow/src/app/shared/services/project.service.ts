import {Injectable} from '@angular/core';
import {RequestService} from './request.service';
import {COMMON_URL} from './common.url';
import {Observable} from 'rxjs/Observable';
import {HelperService} from './helper.service';
import {tap} from 'rxjs/operators';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

@Injectable()
export class ProjectService {

  constructor(public request: RequestService,
              public help: HelperService) {
  }

  getRenderDomain(): Observable<any> {
    return this.request.get(COMMON_URL.node.domain)
      .do(() => {
          // console.log('Update translate is ok.');
        },
        () => {
          console.error('"All categories" error.');
        });
  }

  setRenderDomain(newDomain: any): Observable<any> {
    return this.request.put(COMMON_URL.node.domain, newDomain)
      .do(() => {
          // console.log('Update translate is ok.');
        },
        () => {
          console.error('"All categories" error.');
        });
  }

  createProject(data): Observable<any> {
    return this.request.post(COMMON_URL.project.one, data)
      .do(() => {
          // console.log('Update translate is ok.');
        },
        () => {
          console.error('"All categories" error.');
        });
  }

  updateProject(data): Observable<any> {
    // console.log(data);
    return this.request.put(`${COMMON_URL.project.all}/${data.id}`, data)
      .do(() => {
          // console.log('Update translate is ok.');
        },
        () => {
          console.error('"All categories" error.');
        });
  }

  getPaid(): Observable<any> {
    return this.request.get(`${COMMON_URL.project.paid}`)
  .do(() => {
      console.log('ok');
    });
  }

  changeAnimationStyleProject(data): Observable<any> {
    return this.request.post(`${COMMON_URL.project.change}`, data)
      .do(() => {
          // console.log('Update translate is ok.');
        },
        () => {
          console.error('"All categories" error.');
        });
  }

  getProject(id: string): Observable<any> {
    return this.request.get(`${COMMON_URL.project.one}/${id}`)
      .do((data) => {
          // this.countProjectDuration(data);
          // console.warn('"One blog record" data has received.');
          // this.help.setImageUrl(data);
        },
        () => {
          console.error('Project fetch failed');
        });
  }


  deleteProject(project_id): Observable<any> {
    console.log(project_id);
    return this.request.destroy(`${COMMON_URL.project.one}/${project_id}`);
  }

  listProjects = (): Observable<any> => {
    return this.request.get(COMMON_URL.project.all)
      .do((data) => {
      });
  };

  listMyProjects = (): Observable<any> => {
    return this.request.get(COMMON_URL.project.my)
      .do((data) => {
      });
  };

  updatedExtendedTime(projectId): Observable<any> {
    return this.request.put(`${COMMON_URL.project.extended}/${projectId}`, '')
      .do((data) => {
      });
  }

  uploadFile(file, bod): Promise<any> {
    console.log(file);
    const promise = new Promise<any>((resolve, reject) => {
      const {token} = JSON.parse(localStorage.getItem('currentUser'));
      const url = `${COMMON_URL.node.upload}`;
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      xhr.responseType = 'json';
      xhr.open('POST', url, true);
      // xhr.setRequestHeader('Content-Type', 'multipart/form-data');
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

      formData.append('file', file);
      formData.append('project_id', bod.project_id);
      formData.append('user_id', bod.user_id);


      xhr.send(formData);
    });
    return promise;
  }


  renderProject(data): Observable<any> {
    return this.request.post(COMMON_URL.node.render, data)
      .do(() => {
          console.log('Update translate is ok.');
        },
        () => {
          console.error('"All categories" error.');
        });
  }

  renderOneTemplate(data): Observable<any> {
    return this.request.post(COMMON_URL.node.render, data)
      .do(() => {
          console.log('Update translate is ok.');
        },
        () => {
          console.log('eeee');
        });
  }

  async getPrice(projectLength): Promise<any> {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const userTariff = user['tariff_id'];
    const tariffDetail = await this.getOneTariff(+userTariff).toPromise();
    const tariffSlice = tariffDetail['slices'];
    const tariffPrice = tariffDetail['price'];
    console.log(tariffSlice, tariffPrice, projectLength);

    if (projectLength <= tariffSlice) {
      console.log(tariffPrice);
      return tariffPrice;
    } else {
      console.log('bitch');
      return this.calcOver(tariffPrice, tariffSlice, projectLength);
    }

  }

  async calcOver(price, slice, amount) {
    const fisrtDetail = await this.getOneTariff(1).toPromise();
    const firstPrice = fisrtDetail['price'];
    const cost = price + ((amount - slice) * firstPrice);
    console.log(cost);
    return cost;
  }


  getOneTariff(id: number): Observable<any> {
    return this.request.get(`${COMMON_URL.pricing.one}${id}`)
      .do(data => {
          console.log(data);
          // console.warn('"One tariff" data has received.');
          // return data;
        },
        () => {
          console.error('"One tariff" error.');
        });
  }

  createPayInvoice(obj): Observable<any> {
    return this.request.post(`${COMMON_URL.pay.invoice}`, obj)
      .do(data => {
          console.log(data);
          console.warn('Invoice created');
        },
        () => {
          console.error('Invoice creating error.');
        });
  }

  checkPayment(obj): Observable<any> {
    return this.request.post(`${COMMON_URL.pay.check}`, obj)
      .do(data => {
          console.warn('Check payment completed');
          console.log(data);
        },
        () => {
          console.error('Check payment error.');
        });
  }

  // getQualities(): Observable<any> {
  //   console.warn('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  //   return this.request.get(`${COMMON_URL.qualities.all}`).
  //   do(data => {
  //     console.log(data);
  //   },
  //     () => {
  //     console.error ('Get qualities ERROR');
  //     });
  // }

  getQualities(): Observable<any> {
    return this.request.get(`${COMMON_URL.qualities.all}`).pipe(
      tap((data) => {
        // console.log(data);
      }, () => {
        console.log('getQualities ERROR');
      })
    );
  }

  getProjectQualities(projectId): Observable<any> {
    return this.request.get(`${COMMON_URL.pay.quality}/${projectId}/qualities`).pipe(
      tap((data) => {
        console.log(data);
      }, (error) => {
        console.log('getQualitiesForProject ERROR');
      })
    );
  }

}
