import { Component, OnInit } from '@angular/core';
import { AdminStore } from '../../admin/adminChange/admin.store';
// import { AdminStore } from '../../components/adminChange/admin.store';
// import { ActivatedRoute, Router} from '@angular/router';
// import 'rxjs/add/operator/filter';
// import { AuthService } from '../../shared/services/auth.service';



@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {
  // verify = {token: '', email: ''};

  constructor(private adminStore: AdminStore) { }

  ngOnInit() {
    this.adminStore.changeMetaKey('withoutMeta');
    // this.route.queryParams
    //   .filter(params => params.token)
    //   .filter(params => params.email)
    //   .subscribe(params => {

    //     this.verify.token = params.token;
    //     this.verify.email = params.email;
    //     console.log(this.verify.token);
    //     console.log(this.verify.email);
    //     this.sendParam();
    //   });
    //   }

    //   sendParam() {
    //     this.auth.verifyUser(this.verify)
    //     .subscribe(data => {
    //       localStorage.setItem('currentUser', JSON.stringify(data));
    //       console.log(data);
    //       this.rt.navigate(['']);

    //   });
      }
  }
