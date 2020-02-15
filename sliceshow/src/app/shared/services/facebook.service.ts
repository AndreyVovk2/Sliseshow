import {Injectable} from '@angular/core';
import { FacebookService, InitParams, LoginResponse, LoginOptions } from 'ngx-facebook';
import { AuthService } from './auth.service';

@Injectable()

export class FacebookAuthService {
  logfb = {facebook_id: '', name: '', last_name: '', email: ''};
  constructor(private fb: FacebookService, private auth: AuthService) {
    const initParams: InitParams = {
      appId:
        //  '1927971220769787',
      '243360803098672',
      xfbml: true,
      version: 'v2.8'
    };
    fb.init(initParams);
  }
    optionLog: LoginOptions = {
      scope: 'email,public_profile',
      return_scopes: true,
      // enable_profile_selector: true
  };
    login() {
      this.fb.login(this.optionLog).then(
        (response: any) => {
            console.log(response);
            console.log(response.authResponse.userID);
            this.logfb.facebook_id = response.authResponse.userID;
            this.getFacebookData();
        },
        (error: any) => console.error(error)
      );
    }
    public getFacebookData() {
      this.fb.api('/me?fields=id,last_name,first_name,email').then(
          (response: any) => {
              console.log('Email: ', response.email);
              console.log('LName: ', response.last_name);
              console.log('Fname: ', response.first_name);
              this.logfb.email = response.email;
              this.logfb.name = response.first_name;
              this.logfb.last_name = response.last_name;
              console.log(this.logfb);
              this.saveUser();
          },
          (error: any) => console.error(error)
      );
    }
    saveUser() {
      this.auth.loginFacebook(this.logfb)
      .subscribe(data => {
        console.log(data);
        localStorage.setItem('currentUser', JSON.stringify(data));
        window.location.reload();
    }, error => {
      console.log(error);
      });
    }

}


