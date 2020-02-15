import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit, OnChanges} from '@angular/core';

@Component({
  selector: 'oven-clock',
  templateUrl: './oven-clock.component.html',
  styleUrls: ['./oven-clock.component.scss']
})
export class OvenClockComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('myCanvas') canvasRef: ElementRef;
  @Input() progress: number;
  @Input() height: number;
  @Input() width: number;
  ctx;
  blur;
  centerX;
  centerY;
  radius;
  prnt;
  degree;
  radian;

  constructor() { }

  ngOnInit() {
    console.log(this.progress);
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.radius = this.width / 2 - 5;

    // setInterval(() => { this.refreshData(); }, 1000);
    // setTimeout(() => this.refreshData.call(this), 3000);
  }

  ngAfterViewInit() {
    this.updateCanvas();
  }

  ngOnChanges() {
    this.updateCanvas();
    console.log(this.progress);
  }

  updateCanvas() {
    this.prnt = this.progress;
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    this.degree = this.prnt * 360 / 100;
    this.drawMainCircle();
    this.drawEmptyCircle();
    this.drawTimeNumber();
    this.drawTimeStroke();
    this.drawSegment();
    this.drawLine(45);
    this.drawSmallLine(45);
  }


  refreshData() {
    this.ctx.fillStyle = 'transparent';
    this.ctx.fillRect(0, 0 , this.ctx.canvas.width, this.ctx.canvas.height);
    this.prnt += 5;
    if (this.prnt > 100) {
      this.prnt = 100;
    } 
    this.updateCanvas();
  }

  drawMainCircle() {
      this.ctx.beginPath();
      this.ctx.fillStyle = '#ffffff';
      this.ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI, false);
      this.ctx.fill();
      this.ctx.lineWidth = 7;
      this.ctx.strokeStyle = '#bebcbc';
      this.ctx.stroke();
      this.ctx.closePath();
  }

  drawEmptyCircle() {
    this.ctx.beginPath();
      this.ctx.arc(this.centerX, this.centerY, this.radius - 3.5, 0, 2 * Math.PI, false);
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = '#474747';
      this.ctx.stroke();
      this.ctx.closePath();
  }

  drawTimeStroke() {
      const radiusNum = this.radius - 6; // Радиус расположения рисочек	
      let strokeLength;
      let strokeWidth;
      for (let tm = 0; tm <= 60; tm++) {
      this.ctx.beginPath();
      if (tm % 5 === 0) {
        strokeLength = 12;
        strokeWidth = 4;
      } else {
        strokeLength = 6;
        strokeWidth = 2;
      } 
      // для выделения часовых рисочек
      const xPointM = this.centerX + radiusNum * Math.cos(-6 * tm * (Math.PI / 180) + Math.PI / 2);
      const yPointM = this.centerY - radiusNum * Math.sin(-6 * tm * (Math.PI / 180) + Math.PI / 2);

      const xPointT = this.centerX + (radiusNum - strokeLength) * Math.cos(-6 * tm * (Math.PI / 180) + Math.PI / 2);
      const yPointT = this.centerY - (radiusNum - strokeLength) * Math.sin(-6 * tm * (Math.PI / 180) + Math.PI / 2);

      // this.ctx.beginPath();
      this.ctx.strokeStyle =  '#180a21';
      this.ctx.lineWidth = strokeWidth;
      this.ctx.moveTo(xPointM, yPointM);
      this.ctx.lineTo(xPointT, yPointT);
      this.ctx.stroke();
      this.ctx.closePath();
      }
  }

  drawTimeNumber() {
    // '\u02DA'
      this.ctx.beginPath();
      for (let th = 25; th <= 100; th += 25) {
        const withDegree = th + '\u02DA';
        this.ctx.font = '300 16px "Josefin Sans"';
        this.ctx.strokeStyle = '#cc0033';
        this.ctx.lineWidth = 1;
        const xText = this.centerX + (this.radius - 25) * Math.cos(-90 * th * (Math.PI / 180) + Math.PI / 2);
        const yText = this.centerY - (this.radius - 25) * Math.sin(-90 * th * (Math.PI / 180) + Math.PI / 2);
        if (th === 75) {
          this.ctx.strokeText( withDegree, xText - 2, yText + 1);
        } else {
          this.ctx.strokeText( withDegree, xText - 15, yText + 4);
        }
        
        this.ctx.stroke();	
      }
      this.ctx.closePath();
  }

  drawLine(width) {
    this.ctx.beginPath();
    this.ctx.lineWidth = 8;
    this.ctx.lineJoin = 'round';
    this.ctx.fillStyle =  '#bebcbc';
    this.ctx.strokeStyle =  '#bebcbc';
    const newDegree = Math.atan(width / 10) * 180 / Math.PI;

    this.ctx.moveTo((this.centerX - width * Math.cos((Math.PI / 2 - (this.degree - newDegree / 10) * (Math.PI / 180)))),
                    (this.centerY + width * Math.sin((Math.PI / 2 - (this.degree - newDegree / 10) * (Math.PI / 180)))));
    this.ctx.lineTo((this.centerX - width * Math.cos((Math.PI / 2 - (this.degree + newDegree / 10) * (Math.PI / 180)))),
                    (this.centerY + width * Math.sin((Math.PI / 2 - (this.degree + newDegree / 10) * (Math.PI / 180)))));               
    this.ctx.lineTo(this.centerX + width * Math.cos((Math.PI / 2 - this.degree * (Math.PI / 180))),
                    this.centerY - width * Math.sin((Math.PI / 2 - this.degree * (Math.PI / 180))));
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.fill();
    
  }

  drawSmallLine(width) {
    const newWidth = width - 3;
    this.ctx.beginPath();
    this.ctx.lineWidth = 4;
    this.ctx.lineJoin = 'round';
    this.ctx.fillStyle =  '#180a21';
    const newDegree = Math.atan(newWidth / 10) * 180 / Math.PI;
    
    // this.ctx.moveTo(this.centerX, this.centerY);
    this.ctx.moveTo((this.centerX - newWidth * Math.cos((Math.PI / 2 - (this.degree - newDegree / 14) * (Math.PI / 180)))),
                    (this.centerY + newWidth * Math.sin((Math.PI / 2 - (this.degree - newDegree / 14) * (Math.PI / 180)))));
    this.ctx.lineTo((this.centerX - newWidth * Math.cos((Math.PI / 2 - (this.degree + newDegree / 14) * (Math.PI / 180)))),
                    (this.centerY + newWidth * Math.sin((Math.PI / 2 - (this.degree + newDegree / 14) * (Math.PI / 180)))));               
    this.ctx.lineTo(this.centerX + newWidth * Math.cos((Math.PI / 2 - this.degree * (Math.PI / 180))),
                    this.centerY - newWidth * Math.sin((Math.PI / 2 - this.degree * (Math.PI / 180))));
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.fill();
    
    
  }

  drawSegment() {
    // this.ctx.clearRect(0, 0, 0, 0);
    this.ctx.beginPath();
    if (this.degree >= 360) {
      this.ctx.arc(this.centerX, this.centerY, this.radius - 3.5, 0, 2 * Math.PI, false);
    } else {
      const radian = ((this.degree * Math.PI / 180) - Math.PI / 2);
      this.ctx.moveTo(this.centerX, this.centerY);
      this.ctx.arc(this.centerX, this.centerY, this.radius - 3.5, 
                1.5 * Math.PI, radian, false);
    }
    this.ctx.fillStyle =  'rgba(255, 177, 22, 0.822)';
    this.ctx.fill();
    this.ctx.restore();
    this.ctx.closePath();
  }

// this.ctx.moveTo(centerX - width / 2, centerY - heightBig / 2);
// this.ctx.lineTo(centerX - width / 2, centerY + heightBig / 2);
// this.ctx.lineTo(centerX + width / 2, centerY + heightSmall / 2);
// this.ctx.lineTo(centerX + width / 2, centerY - heightSmall / 2);



}
