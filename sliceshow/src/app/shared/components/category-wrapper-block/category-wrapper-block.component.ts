import {Component, Input, OnInit} from '@angular/core';
import { AppStore } from '../../store/app.store';
// import { AppStore } from '../../shared/store/app.store';

@Component({
  selector: 'app-category-wrapper-block',
  templateUrl: './category-wrapper-block.component.html',
  styleUrls: ['./category-wrapper-block.component.scss']
})
export class CategoryWrapperBlockComponent implements OnInit {
  @Input() category: any;
  @Input() width: any;
  @Input() height: any;
  @Input() border: any;
  @Input() canBeSelected: boolean;

  checked;

  constructor(public store: AppStore) {

  }

  ngOnInit() {
    this.isSelected(this.category.id);
    console.log(this.category);
    // console.log(this.canBeSelected);
  }

  isSelected(id) {
    // console.log(id);
    this.store.isSelected(id) ? this.checked = true : this.checked = false;
    // console.log(this.store.isSelected(id));
  }

  selectCat(id) {
    this.checked ?  this.delCategory(id) : this.addCategory(id);
    // console.log(id);
  }

  addCategory(id) {
    // console.log(1);
    this.store.saveCategory(id);
    this.checked = true;
  }

  delCategory(id) {
    // console.log(2);
    this.store.deleteCategory(id);
    this.checked = false;
  }

}
