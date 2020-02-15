import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'modal-error-render',
  templateUrl: './modal-error-render.component.html',
  styleUrls: ['./modal-error-render.component.scss']
})
export class ModalErrorRenderComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ModalErrorRenderComponent>,) {
  }
name: string;
  ngOnInit() {
    this.getName();
  }

  getName() {
    this.name = localStorage.getItem('user');
  }


  closeModa() {
    this.dialogRef.close();
  }
}
