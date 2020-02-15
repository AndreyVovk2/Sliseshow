import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AppStore } from '../store/app.store';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: AppStore, private router: Router, private route: ActivatedRoute) {}

  canActivate(route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): boolean | Promise<boolean> {
    if (this.store.state.isAuthorized) {
      return true;
    } else {
      this.router.navigate(['']);
    }

  }

}
