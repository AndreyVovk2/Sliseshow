import { Component, OnInit, ViewEncapsulation, isDevMode} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ProjectService } from '../../shared/services/project.service';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { AdminStore } from '../../admin/adminChange/admin.store';
import { ProjectDeletePopupComponent } from '../../shared/modals/project-delete-popup/project-delete-popup.component';
import { ProjectUpgradePopupComponent } from '../../shared/modals/project-upgrade-popup/project-upgrade-popup.component';

@Component({
  selector: 'app-my-project',
  templateUrl: './my-project.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./my-project.component.scss']
})
export class MyProjectComponent implements OnInit {
  public projects = [];
  public isProjectsFetched = false;
  public isError = false;
  public showVar = false;
  public showId: number;
  public ioConnection: any;
  private domainAddress: string;
  private authParam: any;
  private videoLink = 'https://render.grassbusinesslabs.ml/media/';

  constructor(
    public matDialog: MatDialog,
    private adminStore: AdminStore,
    private projectService: ProjectService,
    private readonly notifier: NotifierService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.adminStore.changeMetaKey('withoutMeta');
    // this.getAuthParam();
    this.fetchProjects();
  }

  // private _initIoConnection(): void {
  //   this.socketService.initSocket(this.domainAddress);
  //   this.socketService.onload.next(true);
  //
  //   this.socketService.onEvent('connect').subscribe( (data) => {
  //     this.socketSerive.sendEvent('auth', this.authParam);
  //   });
  // }

  // getAuthParam() {
  //   this.authParam = {
  //     token: JSON.parse(localStorage.getItem('currentUser')).token,
  //     project_id: this.editingStore.state.project.id
  //   };
    // console.log(this.authParam);
    // this.setTimeCode();

  // }

  toogleShare(proj) {
    const {complete_url, id} = proj;
    if (complete_url) {
      this.showVar = true;
      this.showId = id;
    }
  }

  // getDomain () {
  //   this.projectService.getRenderDomain().subscribe(
  //     (result) => {
  //       isDevMode() ? this.domainAddress = result.dev : this.domainAddress = data.prod;
  //   });
  // }

  getPicture(proj) {
    let count = 0;
    if (Array.isArray(proj.animation)) {
       proj.animation.forEach(i => {
         if (i.screens) {
          count += i.screens.length;
         }
      });
    } else if (proj.animation.screens) {
      count = proj.animation.screens.length;
    }
    return count;
  }

  getSlice(proj) {
    return Array.isArray(proj.animation) ? proj.animation.length : 1;
  }

  getLinkedLink(link) {
    return `https://www.linkedin.com/shareArticle?mini=true&url=https%3A
            ${this.videoLink.slice(6) + link}&title=&summary=&source=`;
  }

  getFacebookLink(link) {
    // https%3A
    console.log(link);
    return `https://www.facebook.com/sharer/sharer.php?u=
    ${this.videoLink + link}`;
  }

  getTwitterLink(link) {
    // link.slice(6)
    return `https://twitter.com/home?status=https%3A${this.videoLink.slice(6) + link}`;
  }

  closeAllShared() {
    this.showVar = false;
  }

  openDelete(project_id) {
    this.matDialog.open(ProjectDeletePopupComponent)
      .afterClosed()
      .subscribe(answer => {
        if (!!answer) {
          this.setProjectPending(project_id);
          this.projectService.deleteProject(project_id)
            .subscribe(() => this.deletePendingProject(project_id), () => this.projectNotDeleted(project_id));
        }
      });
  }

  setProjectPending = (id): void => {
    const index = this.projects.findIndex(x => x.id === id);
    if (index > -1) {
      this.projects[index] = { ...this.projects[index], deleting: true };
      // this.projects = this.projects;
    }
  }

  deletePendingProject = (id): void => {
    const index = this.projects.findIndex(x => x.id === id);
    if (index !== -1) {
      this.projects.splice(index, 1);
    }
  }

  projectNotDeleted = (id): void => {
    const index = this.projects.findIndex(x => x.id === id);
    if (index) {
      this.projects[index] = { ...this.projects[index], deleting: false };
    }
    this.notifier.notify('error', 'Project not deleted, please try again');
  };

  editProject(id): void {
    this.router.navigateByUrl('/editing-system/' + btoa(id));
  }

  openUpgrade() {
    const dialogRef = this.matDialog.open(ProjectUpgradePopupComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  isArray(obj: any) {
    return Array.isArray(obj);
  }

  openLink(link) {
    if (link) {
      window.open(this.videoLink + link, '_blank');
    }
  }

  downloadLink(name, link) {
    // return this.videoLink + link + '?download=' + '';
    return this.videoLink + link + '?download=' + name;
    // return this.videoLink + link;
  }



  fetchProjects = () => {
    this.isProjectsFetched = false;
    this.projects = [];
    // this.projectService.listProjects()
    this.projectService.listMyProjects()
      .subscribe(data => {
        this.projects = data;
        console.log(this.projects);
        // console.log(data);
        this.isProjectsFetched = true;
      }, error => {
        this.isProjectsFetched = true;
        this.isError = true;
      });
  }


  checkProjectPaid (currProject) {
    return currProject.paid;
  }

  getOneProject(projectId) {
    let updatedProject;
    this.projectService.getProject(projectId).subscribe(
      (data) => {
        updatedProject = data;
        this.updateProjectList(updatedProject);
      }, (error) => {
        console.log(error);
      });
  }
  updateProjectList(updatedProject) {
    this.projects.map((value, index) => {
      if (value.id === updatedProject.id) {
        this.projects[index] = updatedProject;
      }
    });
  }


  nulifyExtendedTime(projectId) {
    this.projectService.updatedExtendedTime(projectId).subscribe(
      (data) => {
        console.log(data);
        this.getOneProject(projectId);
      }, (error) => {
        console.log(error);
      });

  }

  calculateExtendedTime(expiredAt) {
    const miliSecondsInDay = 86400000;
    const data = +new Date() - +new Date(expiredAt);
    const days = Math.round(Math.abs(data / miliSecondsInDay));
    return days;
  }
}
