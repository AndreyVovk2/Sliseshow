import {Component, ViewChild, OnInit, ElementRef, AfterViewInit, Input} from '@angular/core';
import { AdminStore } from '../../../admin/adminChange/admin.store';
import { AppStore } from '../../store/app.store';

// import {AdminStore} from '../adminChange/admin.store';
// import {AppStore} from '../../shared/store/app.store';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss']
})
export class ProfileHeaderComponent implements OnInit, AfterViewInit {

  @ViewChild('myCanvas') canvasRef: ElementRef;

  height = 158;
  width = 158;
  ctx;
  centerX;
  centerY;
  radius;
  percentUsed = 0;
  percentLeft = 100;
  user;
  mbUsed = 0;

  constructor(public adminStore: AdminStore, public store: AppStore) {
    this.user = this.store.getUserCredentials();
  }

  ngOnInit() {
    console.log(this.user);
    const kbUsed = this.user.used / 1024; // convert Bytes to KB
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.radius = this.width / 2 - 5;
    if (this.user.used) {
      this.mbUsed = (kbUsed / 1024) <= 1 ? 1 : Math.round(kbUsed / 1024);
      this.percentUsed = ((100 * this.mbUsed) / 2048) <= 1 ? 1 : Math.round((100 * this.mbUsed) / 2048);
      this.percentLeft = 100 - this.percentUsed;
    }
  }

  ngAfterViewInit() {
    if (this.user.used) {
      this.drawCircle();
    }
  }

  drawCircle() {
    this.ctx.translate(this.centerX, this.centerY);
    this.ctx.rotate(-Math.PI * 0.5);
    this.ctx.translate(-this.centerX, -this.centerY);
    this.ctx.shadowOffsetX = 2;
    this.ctx.shadowOffsetY = 2;
    this.ctx.shadowBlur    = 4;
    this.ctx.shadowColor   = '#6e6664';
    this.ctx.beginPath();
    this.ctx.moveTo(this.centerX, this.centerY);
    this.ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI * this.percentLeft / 100, true);
    this.ctx.lineWidth = 2;
    this.ctx.fillStyle = '#e5e1d8';
    this.ctx.lineCap = 'square';
    this.ctx.lineTo(this.centerX, this.centerY);
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.fill();
  }

  usedMb() {
    if (localStorage.getItem('currentUser')) {
      this.user = this.store.getUserCredentials();
      const kbUsed = this.user.used / 1024;
      // const userMb = (userUsed / 1024) <= 1 ? 1 : Math.round(userUsed / 1024);
      this.mbUsed = (kbUsed / 1024) <= 1 ? 1 : Math.round(kbUsed / 1024);
      this.percentUsed = ((100 * this.mbUsed) / 2048) <= 1 ? 1 : Math.round((100 * this.mbUsed) / 2048);
      this.percentLeft = 100 - this.percentUsed;
      return this.mbUsed;
    } else {
      return 0;
    }


  }

  usedProcent() {

  }

}
