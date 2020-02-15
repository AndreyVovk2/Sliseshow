import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AppStore } from '../store/app.store';
import { ProjectService } from './project.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserIdGuard implements CanActivate {
    projectId: number;
    constructor(
        private store: AppStore,
        private router: Router,
        private service: ProjectService
    ) {}

    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean> {
            const uncode = route.params.id;
            const decode = atob(uncode);
            const userId = this.store.state.authCredentials.id;
            return this.getProjectId(userId, decode);
    }

    getProjectId(userId, decode) {
        return this.service.getProject(decode)
            .map(data => {
                console.log(data);
                this.projectId = data.user_id;
                return this.checkId(userId);
        });
    }

    checkId(userId) {
        if (userId) {
            console.log(userId, this.projectId);
            if (+userId === +this.projectId) {
                return true;
            } else {
                this.router.navigate(['']);
            }
        } else {
            this.router.navigate(['']);
        }
    }
}
