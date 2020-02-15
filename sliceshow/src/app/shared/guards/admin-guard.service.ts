import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AppStore } from '../store/app.store';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private router: Router, private store: AppStore) {}

    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean | Promise<boolean> {
            if (this.store.state.authCredentials.admin) {
                return true;
            } else {
                this.router.navigate(['']);
            }
        }

}
