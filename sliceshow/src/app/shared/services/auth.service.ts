
import {tap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {RequestService} from './request.service';
import {COMMON_URL} from './common.url';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NotifierService } from 'angular-notifier';
import { HttpHeaders } from '@angular/common/http';
@Injectable()
export class AuthService {

  constructor(public request: RequestService,
              public http: HttpClient,
              private notifier: NotifierService) {
    }

    register(register_value): Observable<any> {
        return this.request.post(COMMON_URL.auth.register, register_value).pipe(
            tap(() => {
                },
                () => {
                    console.log('Error');
                }));
    }
    login(login_value): Observable<any> {
        return this.request.post(COMMON_URL.auth.login, login_value).pipe(
            tap((data) => {
              console.log(data);
                },
                () => {
                    console.log('Error');
                }));
    }
    sandMailRepass(mailRepass_value): Observable<any> {
        return this.request.post(COMMON_URL.auth.send_mail_repassword, mailRepass_value).pipe(
            tap(() => {
                },
                () => {
                    console.log('Error');
                }));
    }
    resetPassword(repass_value): Observable<any> {
        return this.request.post(COMMON_URL.auth.password_reset, repass_value).pipe(
            tap(() => {
                },
                () => {
                    console.log('Error');
                }));
    }
    confirmEmail(confirm_value): Observable<any> {
        return this.request.post(COMMON_URL.auth.confirm_email, confirm_value).pipe(
            tap(() => {
                },
                () => {
                    console.log('Error');
                }));
    }
    loginFacebook(loginFb_value): Observable<any> {
        return this.request.post(COMMON_URL.auth.facebook_login, loginFb_value).pipe(
            tap(() => {
                },
                () => {
                    console.log('Error');
                }));
    }
    changeUser(change_value): Observable<any> {
        return this.request.put(COMMON_URL.auth.update_user, change_value).pipe(
            tap(() => {
                },
                () => {
                    console.log('Error');
                }));
    }
    resendMail(): Observable<any> {
        return this.request.get(COMMON_URL.auth.resend_mail).pipe(
            tap(() => {
                },
                () => {
                    console.log('Error');
                }));
    }
    addSubscribers(mail: any): Observable<any> {
        // post
        return this.request.post(COMMON_URL.auth.subscribers, mail).pipe(
            tap(() => {
                },
                (error) => {
                    console.log(error);
                    if (error.status  === 409) {
                      this.notifier.notify('error', 'This email is already subscribed');
                    }
                    console.log('addSubscribers Error');
                }));
    }
    confirmSubscribe(id, confirm_value): Observable<any> {
    console.log(confirm_value);
     const confirm_token = {'token': confirm_value};
        return this.request.put(`${COMMON_URL.auth.subscribers}/${id}`, confirm_token).pipe(
            tap(() => {
                },
                (error) => {
                    console.log('confirmSubscribe Error');
                    console.log(error);
                }));
    }

    getLimit() {
    console.log('getLimit');
    let getLimitResult;
    // return this.http.get(`${COMMON_URL.auth.limit}`).pipe(
    //   tap ( (data) => {
    //     console.log(data);
    //     this.updateUserStorage(data);
    //   }, () => {
    //   }));
      this.http.get(`${COMMON_URL.auth.limit}`).subscribe( (data) => {
        getLimitResult = data;
        this.updateUserStorage (data);
      }, (error) => {
        console.log(error);
      });
    }



    updateUserStorage (data) {
    let user: any;
    user = JSON.parse(localStorage.getItem('currentUser'));
    user.used = data.used;
    localStorage.setItem('currentUser', JSON.stringify(user));

    }


}
