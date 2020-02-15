import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AdminStore} from '../../admin/adminChange/admin.store';
// import { AdminStore } from '../../components/adminChange/admin.store';
import {SocketService} from '../socket-service';
import {EditingStore} from '../store/editing.store';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {browser} from 'protractor';
import {ProjectService} from '../../shared/services/project.service';

@Component({
  selector: 'app-rendering',
  templateUrl: './rendering.component.html',
  styleUrls: ['./rendering.component.scss']
})
export class RenderingComponent implements OnInit {
  color: any;
  public isProjectsFetched = false;
  public projects = [];
  public isError = false;
  public timeToEnd = 0;
  public progress = 0;
  progreses = [];
  private videoLink = 'https://render.grassbusinesslabs.ml/media/';
  constructor(private adminStore: AdminStore, private socketService: SocketService,
              private editingStore: EditingStore,
              private projectService: ProjectService
  ) {
  }

  @ViewChild('value') value: number;
  @ViewChild('video') video: ElementRef;
  @ViewChild('bufferValue') bufferValue: number;

  ngOnInit() {
    this.adminStore.changeMetaKey('withoutMeta');
    this._initIoConnection();
    this.color = 'white';
    this.value = 75;
    this.bufferValue = 75;
    this.fetchProjects();
  }

  private _initIoConnection(): void {
    this.socketService.onEvent('merge-progress').subscribe(
      (data) => {
        console.log(data);
        this.progreses = data.progress;
        // this.progreses = Math.round((data.timeToEnd) / 60);
        // console.log('Time to End: ' + this.timeToEnd);
      }
    );

    this.socketService.onEvent('renderAndMerge-progress').subscribe(
      (data) => {
        console.log(data);
        this.progress = data.progress;
      }
    );
  }

  load() {
    // function onStartedDownload(id) {
    //   console.log(`Started downloading: ${id}`);
    // }
    // function onFailed(error) {
    //   console.log(`Download failed: ${error}`);
    // }
    // const downLoad = 'https://slice.grassbusinesslabs.ml/storage/animation/image/compression/KAzmSBGVtie8gYBMU371n5QwfwmlCFr0g.PNG';
    // const downloadUrl = browser.downloads.download({
    //   url: downLoad,
    //   filename: 'my-image-again.png',
    //   conflictAction : 'uniquify'
    //
    // });
    // downloadUrl.then(onStartedDownload, onFailed);
  }

  //
  // loadFile(Hello) {
  //   this.download('hello world', 'dlText.txt', 'text/plain');
  //   console.log(Hello);
  // }

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
}

