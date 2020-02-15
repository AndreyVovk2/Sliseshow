import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

import { AuthService } from '../../shared/services/auth.service';
import { AppStore } from '../../shared/store/app.store';


@Component({
  selector: 'app-confirm',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {
  param;
  constructor(private rt: Router, private route: ActivatedRoute, private auth: AuthService, public store: AppStore) { }

  ngOnInit() {
    console.log(this.route.queryParams);
    this.route.queryParams
      .subscribe(params => {
        console.log('ROUTE');
        this.param = params;
        if ('email' in this.param) {
          this.sendParam(this.param.token, this.param.email);
        } else if ('id' in this.param) {
          this.confirmSubscribe (this.param.id, this.param.token);
        } else {
          this.rt.navigate(['']);
        }    
      });
      }

      sendParam(token: string, email: string) {
        console.log('sendParam');
        const verify = {token: token, email: email};
        this.auth.confirmEmail(verify)
        .subscribe(data => {
          localStorage.setItem('currentUser', JSON.stringify(data));
          this.store.saveUser(data);
          this.rt.navigate(['']);
      });
      }

      confirmSubscribe(id: string, subscribeToken: string) {
        console.log('confirmSubscribe');
        console.log(subscribeToken);
        this.auth.confirmSubscribe(id, subscribeToken)
        .subscribe(data => {
          console.log(data);
          // localStorage.setItem('currentUser', JSON.stringify(data));
          // this.store.saveUser(data);
          this.rt.navigate(['']);

      }, (error) => {
          console.log(error);
          this.rt.navigate(['']);
        });
      }

      subscribeStateUpdates = (): void => {
        this.store.state$.subscribe(state => {
          console.log(state);
        });
      }
  }
