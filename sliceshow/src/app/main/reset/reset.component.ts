
import {filter} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {
  reset = {token: '', email: ''};

  constructor(private rt: Router, private route: ActivatedRoute, private auth: AuthService) { }

  ngOnInit() {
    this.route.queryParams.pipe(
      filter(params => params.token),
      filter(params => params.email), )
      .subscribe(params => {
        this.reset.token = params.token;
        this.reset.email = params.email;
        console.log(this.reset.token);
        console.log(this.reset.email);
        localStorage.setItem('changePass', JSON.stringify(this.reset));
        this.rt.navigate(['/'], { queryParams: { resetPop: 'a' } });

      });
      }
  }
