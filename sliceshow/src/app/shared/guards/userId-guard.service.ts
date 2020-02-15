import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { AppStore } from '../store/app.store';
// import { EditingStore } from '../../modules/editing-system/editing.store';
// import { ProjectService } from './project.service';
import { Observable } from 'rxjs/Observable';
import { EditingStore } from '../../editor/store/editing.store';
import { ProjectService } from '../services/project.service';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/operators/take';
// import { take } from 'rxjs/operators';
// import { map } from 'rxjs/operators';

@Injectable()
export class UserIdGuard implements CanActivate {
    projectId: number;
    constructor(
        private store: AppStore, 
        private router: Router, 
        private editingStore: EditingStore,
        private service: ProjectService,
        private route: ActivatedRoute
    ) {}

    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean> {
            const uncode = route.params.id;
            const decode = atob(uncode);
            const userId = this.store.state.authCredentials.id;
            // console.log(this.getProjectId(userId, decode));
            return this.getProjectId(userId, decode);      
    }

    async getProjectId(userId, decode) {
        const asyncRes = await this.service.getProject(decode).toPromise();
        this.projectId = asyncRes['user_id'];
        return await this.checkId(userId);
        // return await this.getId(userId, decode);
        // return this.checkId(userId);
    }

    // getId(userId, decode) {
    //     this.service.getProject(decode)
    //     .subscribe(async data => {
    //             console.log(data);
    //             this.projectId = data.user_id;
    //             console.log(this.projectId);
    //             return await this.checkId(userId);
    //     });
    // }

    checkId(userId) {
        if (userId) {
            // console.log(userId, this.projectId);
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
